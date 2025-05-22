import {
	Button,
	Checkbox,
	Slider,
	Switch,
	Typography,
} from '@material-tailwind/react'
import type { SubShomaarSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../../../shared/widgetKey'
import { getYoutubeProfile } from '../../../api/hooks/channel/youtube-profile.hook'
import { NeedAuthMessage } from '../../../components/need-auth-message'
import { useAuth } from '../../../context/auth.context'
import { formatSubscribeCount } from '../../../utils/format'

export function SubShomaarSetting() {
	const { isAuthenticated } = useAuth()
	const [setting, setSetting] = useState<SubShomaarSettingStore>(null)
	const [inputChannelName, setInputChannelName] = useState<string>('')
	const [isLoadingChannel, setIsLoadingChannel] = useState<boolean>(false)
	const [channelInfo, setChannelInfo] = useState<any>(null)

	useEffect(() => {
		const SubShomaar: SubShomaarSettingStore = window.store.get(
			widgetKey.SubShomaar,
		)
		SubShomaar.borderRadius = SubShomaar.borderRadius || 12
		setSetting(SubShomaar)
		setInputChannelName(SubShomaar.channelName || '')
	}, [])

	function setSettingValue<T extends keyof SubShomaarSettingStore>(
		key: T,
		value: SubShomaarSettingStore[T],
	) {
		setting[key] = value
		setSetting({ ...setting })
		applyChanges()

		if (key === 'enable') {
			window.ipcRenderer.send('toggle-enable', widgetKey.SubShomaar)
		} else if (!['borderRadius'].includes(key)) {
			window.ipcRenderer.send('updated-setting', widgetKey.SubShomaar)
		}
	}

	function applyChanges() {
		window.store.set(widgetKey.SubShomaar, {
			...setting,
			alwaysOnTop: setting.alwaysOnTop,
			enable: setting.enable,
			bounds: window.store.get('SubShomaar' as widgetKey.SubShomaar).bounds,
			channelName: setting.channelName,
			borderRadius: setting.borderRadius,
			subscriberFormat: setting.subscriberFormat,
		})
	}

	async function handleChannelSearch() {
		if (!inputChannelName) return
		const channelName = inputChannelName.replace(/ /g, '').replace(/@/g, '')

		setIsLoadingChannel(true)
		const channel = await getYoutubeProfile(channelName)
		if (channel.isValid) {
			applyChanges()
			setSettingValue('channelName', channelName)
			setChannelInfo(channel)
			setIsLoadingChannel(false)
		} else {
			setChannelInfo({
				...channel,
				isValid: false,
			})
			setIsLoadingChannel(false)
		}
	}

	async function onSliderChange(value: number) {
		const fixedValue = Math.floor(value)

		await window.ipcRenderer.invoke(
			'setBorderRadius',
			widgetKey.SubShomaar,
			`${fixedValue}px`,
		)
		setSettingValue('borderRadius', fixedValue)
	}

	async function onChannelInputChange(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		setInputChannelName(event.target.value)
	}

	if (!setting) return null

	if (!isAuthenticated) {
		return (
			<NeedAuthMessage
				widgetName="ساب‌شمار"
				widgetDescription="برای استفاده از ویجت ساب‌شمار و نمایش تعداد دنبال‌کنندگان کانال یوتیوب، لطفا وارد حساب کاربری خود شوید."
			/>
		)
	}

	return (
		<>
			<div className="p-2 mt-2 h-full not-moveable font-[Vazir] overflow-y-scroll custom-scrollbar">
				<div className="flex flex-col gap-3">
					<div className="flex flex-row items-center justify بین w-full gap-2">
						<Switch
							id={'sub-shomaar-enable'}
							color={'blue'}
							defaultChecked={setting.enable}
							onClick={() => setSettingValue('enable', !setting.enable)}
							label={
								<div>
									<Typography
										variant={'h5'}
										color="blue-gray"
										className="text-gray-600  dark:text-[#c7c7c7] text-[13px] font-[Vazir] flex flex-row items-center mr-3"
									>
										فعال سازی
									</Typography>
									<Typography
										variant="h5"
										color="gray"
										className="dark:text-gray-500 text-gray-600 text-[12px] font-[Vazir] mr-3"
									>
										فعالسازی ویجت ساب‌شمار
									</Typography>
								</div>
							}
							containerProps={{
								className: '-mt-5 mr-2',
							}}
						/>
					</div>

					<div className="flex flex-col">
						<Checkbox
							ripple={true}
							defaultChecked={setting.alwaysOnTop}
							onClick={() =>
								setSettingValue('alwaysOnTop', !setting.alwaysOnTop)
							}
							label={
								<div>
									<Typography
										variant={'h5'}
										color="blue-gray"
										className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir]"
									>
										اولویت بالا{' '}
										<span className="font-light">(همیشه بالای همه باشد)</span>
									</Typography>
								</div>
							}
							containerProps={{
								className: 'flex',
							}}
						/>

						<Checkbox
							ripple={true}
							defaultChecked={setting.subscriberFormat === 'short'}
							onClick={() =>
								setSettingValue(
									'subscriberFormat',
									setting.subscriberFormat === 'short' ? 'full' : 'short',
								)
							}
							label={
								<div>
									<Typography
										variant={'h5'}
										color="blue-gray"
										className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir]"
									>
										نمایش کوتاه تعداد مشترکین{' '}
										<span className="font-light">(K/M/B)</span>
									</Typography>
								</div>
							}
							containerProps={{
								className: 'flex',
							}}
						/>
					</div>

					<div className="flex flex-col justify بین w-full ">
						<label
							htmlFor="border-radius-slider"
							className="text-gray-600 dark:text-[#eee] font-semibold text-sm"
						>
							حاشیه ها
						</label>
						<div className="flex items-center gap-2 px-2 py-2 rounded w-36 h-fit">
							<Slider
								size="md"
								color="blue"
								defaultValue={setting.borderRadius}
								onChange={(change) =>
									onSliderChange(Number(change.target.value))
								}
							/>
							<div className="flex flex-row justify بین w-full text-gray-600 dark:text-[#eee]">
								{setting.borderRadius}px
							</div>
						</div>
					</div>

					<div
						className="flex flex-col items-center justify بین w-full gap-2"
						dir="rtl"
					>
						<div className="text-gray-600 mb-2 dark:text-gray-300 text-sm p-2 bg-[#e8e6e6] dark:bg-[#24242459] rounded-lg mt-2 w-full">
							<p className="text-sm font-light text-wrap">
								این ویجت اطلاعات کانال یوتیوب (تعداد دنبال‌کنندگان و تصویر
								پروفایل) را نمایش داده و هر ۳ دقیقه بروزرسانی می‌شود.
							</p>
						</div>
						<div
							className="flex flex-col justify بین w-full gap-2 not-moveable"
							dir="rtl"
						>
							<label
								htmlFor="channel-input"
								className="text-gray-600 dark:text-[#eee] font-semibold"
							>
								نام کانال
							</label>
							<div className="flex flex-row items-center gap-2">
								<input
									type="text"
									id="channel-input"
									className="flex-1 bg-gray-100 dark:bg-[#3e3e3e] dark:text-[#eee] text-gray-600 text-[13px]
									font-[Vazir] rounded-md p-2
									outline-none border-2 border-gray-200 dark:border-[#444] transition-all duration-300
									focus:ring-0 focus:ring-blue-500 focus:border-blue-500
									placeholder-gray-600 focus:placeholder-gray-500
									"
									value={inputChannelName}
									onChange={onChannelInputChange}
									dir="ltr"
									placeholder="نام کانال را وارد کنید..."
								/>
								<Button
									size="md"
									color="blue"
									className="min-w-[90px] flex items-center justify-center gap-1 font-[Vazir]"
									onClick={handleChannelSearch}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-4 h-4"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
										/>
									</svg>
									جستجو
								</Button>
							</div>
						</div>
						<div
							className="flex flex-col items-center justify بین w-full mt-2"
							dir="ltr"
						>
							{setting.channelName ? (
								isLoadingChannel ? (
									<div className="flex items-center justify-center p-2">
										<div className="w-5 h-5 border-2 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
										<span className="mr-2 text-gray-600 dark:text-[#eee] text-[13px] font-[Vazir]">
											در حال بارگیری اطلاعات کانال...
										</span>
									</div>
								) : channelInfo?.isValid ? (
									<div className="flex flex-col w-full gap-2 font-[balooTamma]">
										<div className="flex flex-row items-center justify-between rounded-md p-2 bg-gray-100 dark:bg-[#2d2c2c]">
											<div className="flex items-center gap-2">
												{channelInfo.profile && (
													<img
														src={channelInfo.profile}
														alt={channelInfo.name}
														className="w-8 h-8 rounded-full"
													/>
												)}
												<span className="text-gray-800 dark:text-[#eee] text-[13px] font-[Vazir] font-medium">
													{channelInfo.name}
												</span>
											</div>
											<div className="flex items-center gap-1">
												<span className="text-red-500 font-bold text-[13px]">
													{setting.subscriberFormat === 'short'
														? formatSubscribeCount(channelInfo.subscribers)
														: channelInfo.subscribers}
												</span>
												<span className="text-gray-600 dark:text-gray-400 text-[11px] font-thin">
													subscribers
												</span>
											</div>
										</div>
									</div>
								) : (
									<div
										className="flex flex-row items-center w-full p-2 rounded-md bg-red-50 dark:bg-red-900/20"
										dir="rtl"
									>
										<div className="flex items-center gap-1">
											<span className="text-red-600 dark:text-red-400 text-[13px] font-[Vazir]">
												کانال یافت نشد!
											</span>
										</div>
									</div>
								)
							) : (
								<div className="flex flex-row items-center justify بین w-full text-gray-500">
									<div className="flex items-center gap-1">
										<span className="text-gray-600 dark:text-[#aaa] text-[12px] font-[Vazir]">
											لطفا نام کانال یوتیوب را وارد کنید
										</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
