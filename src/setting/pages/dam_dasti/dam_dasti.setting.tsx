import { Checkbox, Slider, Switch, Typography } from '@material-tailwind/react'
import type { DamDastiSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../../../shared/widgetKey'

export function DamDastiSetting() {
	const [setting, setSetting] = useState<DamDastiSettingStore>(null)

	useEffect(() => {
		const DamDasti: DamDastiSettingStore = window.store.get(widgetKey.DamDasti)
		setSetting(DamDasti)
		DamDasti.borderRadius = DamDasti.borderRadius || 28
	}, [])

	function setSettingValue<T extends keyof DamDastiSettingStore>(
		key: T,
		value: DamDastiSettingStore[T],
	) {
		setting[key] = value
		setSetting({ ...setting })
		applyChanges()

		if (key === 'enable') {
			window.ipcRenderer.send('toggle-enable', widgetKey.DamDasti)
		} else if (!['borderRadius'].includes(key)) {
			window.ipcRenderer.send('updated-setting', widgetKey.DamDasti)
		}
	}

	function applyChanges() {
		window.store.set(widgetKey.DamDasti, {
			...setting,
			alwaysOnTop: setting.alwaysOnTop,
			enable: setting.enable,

			bounds: window.store.get(widgetKey.DamDasti).bounds,

			borderRadius: setting.borderRadius,
		})
	}
	if (!setting) return null

	async function onSliderChange(value: number) {
		const fixedValue = Math.floor(value)

		await window.ipcRenderer.invoke(
			'setBorderRadius',
			widgetKey.DamDasti,
			`${fixedValue}px`,
		)
		setSettingValue('borderRadius', fixedValue)
	}

	return (
		<>
			<div className="p-2 mt-2 h-80 not-moveable font-[Vazir] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-800">
				<div className="flex flex-col gap-3">
					<div className="flex flex-row items-center justify-between w-full gap-2">
						<Switch
							id={'damdasti-enable'}
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
										فعالسازی ویجت دم‌دستی
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
				</div>
			</div>
		</>
	)
}
