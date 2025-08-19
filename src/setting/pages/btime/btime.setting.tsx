import { Checkbox, Slider, Switch, Typography } from '@material-tailwind/react'
import type { BtimeSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../../../shared/widgetKey'

export function BtimeSetting() {
	const [setting, setSetting] = useState<BtimeSettingStore>(null)
	useEffect(() => {
		const btime: BtimeSettingStore = window.store.get(widgetKey.BTime)
		btime.borderRadius = btime.borderRadius || 28
		setSetting(btime)
	}, [])

	function setSettingValue<T extends keyof BtimeSettingStore>(
		key: T,
		value: BtimeSettingStore[T],
	) {
		setting[key] = value
		setSetting({ ...setting })

		applyChanges()

		if (key === 'enable') {
			window.ipcRenderer.send('toggle-enable', widgetKey.BTime)
		} else if (!['borderRadius'].includes(key)) {
			window.ipcRenderer.send('updated-setting', widgetKey.BTime)
		}
	}

	function applyChanges() {
		window.store.set(widgetKey.BTime, {
			...setting,
			alwaysOnTop: setting.alwaysOnTop,
			enable: setting.enable,

			bounds: window.store.get(widgetKey.BTime).bounds,
			borderRadius: setting.borderRadius,
		})
	}

	if (!setting) return null

	return (
		<>
			<div className="p-2 mt-2 h-full not-moveable font-[Vazir] overflow-y-scroll custom-scrollbar">
				<div className="flex flex-col gap-4">
					<Switch
						id={'time-startUp'}
						color={'blue'}
						defaultChecked={setting.enable}
						onClick={() => setSettingValue('enable', !setting.enable)}
						label={
							<div>
								<Typography
									variant={'h5'}
									color="blue-gray"
									className="text-content text-[13px] font-[Vazir] mr-3"
								>
									فعال سازی
								</Typography>
								<Typography
									variant="h5"
									color="gray"
									className="text-muted text-xs font-[Vazir] mr-3"
								>
									فعالسازی ویجت نمایش تاریخ
								</Typography>
							</div>
						}
						containerProps={{
							className: '-mt-5 mr-2',
						}}
					/>
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
										className="text-content text-[13px] font-[Vazir] items-center "
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
							defaultChecked={setting.showCalendar}
							onClick={() =>
								setSettingValue('showCalendar', !setting.showCalendar)
							}
							label={
								<div>
									<Typography
										variant={'h5'}
										color="blue-gray"
										className="text-content text-[13px] font-[Vazir] items-center "
									>
										نمایش تقویم{' '}
										<span className="font-light">
											(نمایش روزهای ماه در سمت چپ ویجت)
										</span>
									</Typography>
								</div>
							}
							containerProps={{
								className: 'flex',
							}}
						/>
					</div>
					<div className="w-full">
						<label className="text-sm font-semibold text-content">
							نوع تقویم
						</label>
						<div className="flex w-full gap-2 px-2 py-2 mt-2 rounded-lg h-14 bg-content">
							<CalendarItem
								title="جلالی"
								selected={setting.currentCalender === 'Jalali'}
								onClick={() => setSettingValue('currentCalender', 'Jalali')}
							/>
							<CalendarItem
								title="میلادی"
								selected={setting.currentCalender === 'Gregorian'}
								onClick={() => setSettingValue('currentCalender', 'Gregorian')}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

function CalendarItem({ title, selected, onClick }) {
	return (
		<div
			onClick={onClick}
			className={`w-full h-10 flex justify-center items-center rounded-lg text-content cursor-pointer ${
				selected
					? 'bg-gray-300'
					: 'hover:bg-[#f5f5f578] dark:hover:bg-[#3a3a3a5c]'
			} 
        ${selected && '!text-gray-800'}
        transition-all  ease-in-out duration-2000`}
		>
			{title}
		</div>
	)
}
