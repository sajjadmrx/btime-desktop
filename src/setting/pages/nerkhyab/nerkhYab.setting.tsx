import { Checkbox, Slider, Switch, Typography } from '@material-tailwind/react'
import type { NerkhYabSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import {
	getSupportedCurrencies,
	sendEvent,
	type SupportedCurrencies,
} from '../../../api/api'
import { widgetKey } from '../../../../shared/widgetKey'

export function NerkhYabSetting() {
	const [setting, setSetting] = useState<NerkhYabSettingStore>(null)
	const [supportedCurrencies, setSupportedCurrencies] =
		useState<SupportedCurrencies>(null)

	useEffect(() => {
		const NerkhYab: NerkhYabSettingStore = window.store.get(widgetKey.NerkhYab)
		setSetting(NerkhYab)
		NerkhYab.borderRadius = NerkhYab.borderRadius || 28
		function fetchSupportedCurrencies() {
			getSupportedCurrencies().then((data) => {
				setSupportedCurrencies(data)
			})
		}

		fetchSupportedCurrencies()
	}, [])

	function setSettingValue<T extends keyof NerkhYabSettingStore>(
		key: T,
		value: NerkhYabSettingStore[T],
	) {
		setting[key] = value
		setSetting({ ...setting })
		applyChanges()

		if (key === 'transparentStatus') {
			window.ipcRenderer.send('toggle-transparent', widgetKey.NerkhYab)
		}

		if (!['borderRadius'].includes(key)) {
			sendEvent({
				name: `setting_${key}`,
				value: value,
				widget: widgetKey.NerkhYab,
			})
		}

		if (key === 'enable') {
			window.ipcRenderer.send('toggle-enable', widgetKey.NerkhYab)
		} else if (!['transparentStatus', 'borderRadius'].includes(key)) {
			window.ipcRenderer.send('updated-setting', widgetKey.NerkhYab)
		}
	}

	function applyChanges() {
		window.store.set<widgetKey.NerkhYab, NerkhYabSettingStore>(
			widgetKey.NerkhYab,
			{
				...setting,
				alwaysOnTop: setting.alwaysOnTop,
				enable: setting.enable,
				transparentStatus: setting.transparentStatus,
				bounds: window.store.get(widgetKey.NerkhYab).bounds,
				currencies: setting.currencies,
				borderRadius: setting.borderRadius,
			},
		)
	}
	if (!setting) return null

	async function onSliderChange(value: number) {
		const fixedValue = Math.floor(value)

		await window.ipcRenderer.invoke(
			'setBorderRadius',
			widgetKey.NerkhYab,
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
							id={'nerkhyaab-enable'}
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
										فعالسازی ویجت نرخ یاب
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
					<div
						className="flex flex-row items-center justify-between w-full gap-2"
						dir="rtl"
					>
						<div
							className="flex flex-col justify-between w-full gap-2"
							dir="rtl"
						>
							<label
								htmlFor="currency-select"
								className="text-gray-600 dark:text-[#eee] font-semibold"
							>
								انتخاب ارز:
							</label>
							<select
								id="currency-select"
								className="form-select block w-60 mr-2 h-11 mt-1 text-gray-600 dark:text-[#eee] bg-white dark:bg-gray-800
                 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none
                focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
								onChange={(e) =>
									setSettingValue('currencies', [e.target.value])
								}
								value={setting.currencies[0]}
							>
								{supportedCurrencies &&
									Object.keys(supportedCurrencies).map((key) => (
										<option key={key} value={key} className="font-light">
											{supportedCurrencies[key].label}
										</option>
									))}
							</select>
						</div>
					</div>

					<div className="flex flex-col justify-between w-full ">
						<label
							htmlFor="currency-select"
							className="text-gray-600 dark:text-[#eee] font-semibold text-sm"
						>
							حاشیه ها
						</label>
						<div className="flex items-center gap-2 w-36 h-fit rounded px-2 py-2">
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
				</div>
			</div>
		</>
	)
}
