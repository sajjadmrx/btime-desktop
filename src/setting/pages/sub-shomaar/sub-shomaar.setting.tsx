import { Checkbox, Slider, Switch, Typography } from '@material-tailwind/react'
import type { SubShomaarSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../../../shared/widgetKey'
import { useGetYoutubeProfile } from '../../../api/hooks/channel/youtube-profile.hook'
import { formatSubscribeCount } from '../../../utils/format'

export function SubShomaarSetting() {
	const [setting, setSetting] = useState<SubShomaarSettingStore>(null)

	useEffect(() => {
		const SubShomaar: SubShomaarSettingStore = window.store.get(
			widgetKey.SubShomaar,
		)
		SubShomaar.borderRadius = SubShomaar.borderRadius || 12
		setSetting(SubShomaar)
	}, [])

	const { data: channelInfo, isLoading: isLoadingChannel } =
		useGetYoutubeProfile(
			setting?.channelName || '',
			!!setting?.channelName,
			null,
		)

	function setSettingValue<T extends keyof SubShomaarSettingStore>(
		key: T,
		value: SubShomaarSettingStore[T],
	) {
		setting[key] = value
		setSetting({ ...setting })
		applyChanges()

		if (key === 'transparentStatus') {
			window.ipcRenderer.send('toggle-transparent', widgetKey.SubShomaar)
		}

		if (key === 'isBackgroundDisabled') {
			window.ipcRenderer.send(
				'toggle-isBackgroundDisabled',
				widgetKey.SubShomaar,
			)
		}

		if (key === 'enable') {
			window.ipcRenderer.send('toggle-enable', widgetKey.SubShomaar)
		} else if (
			!['transparentStatus', 'borderRadius', 'isBackgroundDisabled'].includes(
				key,
			)
		) {
			window.ipcRenderer.send('updated-setting', widgetKey.SubShomaar)
		}
	}

	function applyChanges() {
		window.store.set(widgetKey.SubShomaar, {
			...setting,
			alwaysOnTop: setting.alwaysOnTop,
			enable: setting.enable,
			transparentStatus: setting.transparentStatus,
			bounds: window.store.get('SubShomaar' as widgetKey.SubShomaar).bounds,
			channelName: setting.channelName,
			borderRadius: setting.borderRadius,
			subscriberFormat: setting.subscriberFormat,
		})
	}

	async function onChangeChannelInput(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		if (!event.target.value) return
		const channelName = event.target.value.replace(/ /g, '').replace(/@/g, '')

		setSettingValue('channelName', channelName)
		applyChanges()
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

	if (!setting) return null
	return (
		<>
			<div className="p-2 mt-2 h-80 not-moveable font-[Vazir] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-800">
				<div className="flex flex-col gap-3">
					<div className="flex flex-row items-center justify-between w-full gap-2">
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
										فعالسازی ویجت زیرشمار
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
							defaultChecked={setting.transparentStatus}
							onClick={() =>
								setSettingValue('transparentStatus', !setting.transparentStatus)
							}
							label={
								<div>
									<Typography
										variant={'h5'}
										color="blue-gray"
										className="dark:text-[#c7c7c7] text-gray-600  text-[13px] font-[Vazir]"
									>
										شفاف <span className="font-light">(پس زمینه شفاف)</span>
									</Typography>
								</div>
							}
							containerProps={{
								className: 'flex',
							}}
						/>
						<Checkbox
							ripple={true}
							defaultChecked={setting.isBackgroundDisabled}
							onClick={() =>
								setSettingValue(
									'isBackgroundDisabled',
									!setting.isBackgroundDisabled,
								)
							}
							label={
								<div>
									<Typography
										variant={'h5'}
										color="blue-gray"
										className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir] items-center "
									>
										غیرفعال کردن پشت زمینه{' '}
										<span className="font-light">
											(غیرفعال کردن نمایش پشت زمینه برای ویجت)
										</span>
									</Typography>
								</div>
							}
							containerProps={{
								className: 'flex',
							}}
						/>
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

					<div className="flex flex-col justify-between w-full ">
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
							<div className="flex flex-row justify-between w-full text-gray-600 dark:text-[#eee]">
								{setting.borderRadius}px
							</div>
						</div>
					</div>

					<div
						className="flex flex-col items-center justify-between w-full gap-2"
						dir="rtl"
					>
						<div
							className="flex flex-col justify-between w-full gap-2 not-moveable"
							dir="rtl"
						>
							<label
								htmlFor="channel-input"
								className="text-gray-600 dark:text-[#eee] font-semibold"
							>
								نام کانال
							</label>
							<input
								type="text"
								id="channel-input"
								className="w-full bg-gray-100 dark:bg-[#3e3e3e] dark:text-[#eee] text-gray-600 text-[13px]
                 font-[Vazir] rounded-md p-2
                 outline-none border-2 border-gray-200 dark:border-[#444] transition-all duration-300
                  focus:ring-0 focus:ring-blue-500 focus:border-blue-500
                  placeholder-gray-600 focus:placeholder-gray-500
                 "
								defaultValue={setting.channelName}
								onChange={onChangeChannelInput}
								dir="ltr"
								placeholder="نام کانال را وارد کنید..."
							/>
						</div>
						<div
							className="flex flex-col items-center justify-between w-full mt-2"
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
									<div className="flex flex-row items-center justify-between w-full p-2 rounded-md bg-red-50 dark:bg-red-900/20">
										<div className="flex items-center gap-1">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-4 h-4 text-red-500"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
												/>
											</svg>
											<span className="text-red-600 dark:text-red-400 text-[13px] font-[Vazir]">
												کانال یافت نشد!
											</span>
										</div>
									</div>
								)
							) : (
								<div className="flex flex-row items-center justify-between w-full text-gray-500">
									<div className="flex items-center gap-1">
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
												d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
											/>
										</svg>
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
