import {
	Checkbox,
	Slider,
	Switch,
	Tab,
	TabPanel,
	Tabs,
	TabsBody,
	TabsHeader,
	Typography,
} from '@material-tailwind/react'
import type { ClockSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../../../shared/widgetKey'
import { getTimezones } from '../../../api/api'
import type { Timezone } from '../../../api/api.interface'
import { NeedAuthMessage } from '../../../components/need-auth-message'
import { useAuth } from '../../../context/auth.context'
import { AnalogAClockTab } from './tabs/analogA'
import { DigitalClockTab } from './tabs/digital'

type T<K extends keyof ClockSettingStore> = ClockSettingStore[K] extends object
	? Partial<ClockSettingStore[K]>
	: ClockSettingStore[K]

export type SetSettingValue = <K extends keyof ClockSettingStore>(
	key: K,
	value: T<K>,
) => void

export function ClockSetting() {
	const [setting, setSetting] = useState<ClockSettingStore>(null)
	const [timezones, setTimeZones] = useState<Timezone[]>([])
	const { isAuthenticated } = useAuth()
	useEffect(() => {
		const clock: ClockSettingStore = window.store.get(widgetKey.Clock)
		setSetting(clock)

		function fetchTimezones() {
			getTimezones().then((data) => {
				setTimeZones(data)
			})
		}

		fetchTimezones()
		return () => {
			fetchTimezones()
		}
	}, [])
	/// if value is object, convert to optional feild

	function setSettingValue<K extends keyof ClockSettingStore>(
		key: K,
		value: T<K>,
	) {
		if (typeof value === 'object') {
			setting[key] = {
				//@ts-ignore
				...setting[key],
				...value,
			}
		} else {
			setting[key] = value as ClockSettingStore[K]
		}
		setSetting({ ...setting })
		applyChanges()

		if (key === 'enable') {
			window.ipcRenderer.send('toggle-enable', widgetKey.Clock)
		}
	}

	function applyChanges() {
		window.store.set(widgetKey.Clock, {
			...setting,
			alwaysOnTop: setting.alwaysOnTop,
			enable: setting.enable,

			bounds: window.store.get(widgetKey.Clock).bounds,
		})
	}

	if (!setting) return null
	if (!isAuthenticated) {
		return (
			<NeedAuthMessage
				widgetName="ساعت"
				widgetDescription="برای دسترسی به تنظیمات و قابلیت‌های کامل ویجت ساعت، لطفا وارد حساب کاربری خود شوید. این به شما امکان می‌دهد تا از تمام امکانات شخصی‌سازی بهره‌مند شوید."
			/>
		)
	}
	return (
		<>
			<div className="p-2 mt-2 h-full not-moveable font-[Vazir] overflow-y-scroll custom-scrollbar">
				<div className="flex flex-col gap-4">
					<div className="flex flex-row items-center justify-between w-full gap-2">
						<Switch
							id={'clock-startUp'}
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
										فعالسازی ویجت ساعت
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
					</div>

					<div className="w-full">
						<label className="text-gray-600 dark:text-[#eee] font-semibold text-sm">
							قالب ساعت
						</label>
						<div className="flex flex-col gap-2 w-full h-full rounded-lg p-2 dark:bg-[#464545] bg-[#e8e6e6]">
							<Tabs id="clock-tabs" value={setting.currentClock || 'digital'}>
								<TabsHeader
									className="dark:bg-[#363636] bg-[#cac8c8]"
									indicatorProps={{
										className: 'bg-white dark:bg-[#1d1d1d]',
									}}
								>
									<Tab
										id="digital"
										value={'digital'}
										className="hover:bg-gray-100  dark:hover:bg-[#313131] transition-colors duration-200"
										onClick={() => setSettingValue('currentClock', 'digital')}
									>
										<Typography
											variant="h5"
											color="gray"
											className="text-gray-600 dark:text-[#b5b5b5] text-[12px] font-[Vazir]"
										>
											دیجیتال
										</Typography>
									</Tab>
									<Tab
										id="analog"
										value={'analogA'}
										className="hover:bg-gray-100  dark:hover:bg-[#313131] transition-colors duration-200"
										onClick={() => setSettingValue('currentClock', 'analogA')}
									>
										<Typography
											variant="h5"
											color="gray"
											className="dark:text-gray-500 text-gray-600 text-[12px] font-[Vazir]"
										>
											آنالوگ
										</Typography>
									</Tab>
								</TabsHeader>
								<TabsBody className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-800">
									<DigitalClockTab
										digital={setting.digital}
										timezones={timezones}
										setSettingValue={setSettingValue}
									/>
									<AnalogAClockTab
										analog={setting.analogA}
										timezones={timezones}
										setSettingValue={setSettingValue}
									/>
								</TabsBody>
							</Tabs>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
