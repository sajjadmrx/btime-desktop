import { Checkbox, Slider, Switch, Typography } from '@material-tailwind/react'
import type { ArzChandSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import {
	getSupportedCurrencies,
	sendEvent,
	type SupportedCurrencies,
} from '../../../api/api'
import { widgetKey } from '../../../../shared/widgetKey'
import { MultiSelectDropdown } from '../../components/multiSelectDropdown.component'

export function ArzChandSetting() {
	const [setting, setSetting] = useState<ArzChandSettingStore>(null)
	const [supportedCurrencies, setSupportedCurrencies] =
		useState<SupportedCurrencies>()

	useEffect(() => {
		const ArzChand: ArzChandSettingStore = window.store.get(widgetKey.ArzChand)
		ArzChand.borderRadius = ArzChand.borderRadius || 28
		setSetting(ArzChand)

		function fetchSupportedCurrencies() {
			getSupportedCurrencies().then((data) => {
				setSupportedCurrencies(data)
			})
		}

		fetchSupportedCurrencies()
	}, [])

	function setSettingValue<T extends keyof ArzChandSettingStore>(
		key: T,
		value: ArzChandSettingStore[T],
	) {
		setting[key] = value
		setSetting({ ...setting })
		applyChanges()

		if (key === 'transparentStatus') {
			window.ipcRenderer.send('toggle-transparent', widgetKey.ArzChand)
		}

		if (!['borderRadius', 'shadow'].includes(key)) {
			sendEvent({
				name: `setting_${key}`,
				value: value,
				widget: widgetKey.ArzChand,
			})
		}

		if (key === 'enable') {
			window.ipcRenderer.send('toggle-enable', widgetKey.ArzChand)
		} else if (!['transparentStatus', 'borderRadius', 'shadow'].includes(key)) {
			window.ipcRenderer.send('updated-setting', widgetKey.ArzChand)
		}
	}

	function applyChanges() {
		window.store.set<widgetKey, ArzChandSettingStore>(widgetKey.ArzChand, {
			...setting,
			alwaysOnTop: setting.alwaysOnTop,
			enable: setting.enable,
			transparentStatus: setting.transparentStatus,
			bounds: window.store.get(widgetKey.ArzChand).bounds,
			currencies: setting.currencies,
			borderRadius: setting.borderRadius,
			shadow: setting.shadow,
		})
	}

	async function onSliderChange(value: number) {
		const fixedValue = Math.floor(value)

		await window.ipcRenderer.invoke(
			'setBorderRadius',
			widgetKey.ArzChand,
			`${fixedValue}px`,
		)
		setSettingValue('borderRadius', fixedValue)
	}

	if (!setting) return null
	return (
		<>
			<div className="p-2 mt-2 h-80 not-moveable font-[Vazir] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-800">
				<div className="flex flex-col gap-4">
					<Switch
						id={'arzChand-enable'}
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
									فعالسازی ویجت ارز چند (نمایش قیمت ارزها)
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
						<Checkbox
							ripple={true}
							defaultChecked={setting.shadow}
							onClick={() =>
								setSettingValue('shadow', !setting.shadow)
							}
							label={
								<div>
									<Typography
										variant={'h5'}
										color="blue-gray"
										className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir]"
									>
										سایه{' '}
										<span className="font-light">(افزودن سایه به ویجت)</span>
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
					<div
						className="flex flex-row items-center justify-between w-full gap-2"
						dir="rtl"
					>
						<div
							className="flex flex-col justify-between w-96 gap-2 "
							dir="rtl"
						>
							<label
								htmlFor="currency-select"
								className="text-gray-600 dark:text-[#eee] font-semibold"
							>
								انتخاب ارز:
							</label>
							{supportedCurrencies && (
								<MultiSelectDropdown
									options={getCurrencyOptions(supportedCurrencies)}
									values={getSelectedCurrencies(
										setting.currencies,
										supportedCurrencies,
									)}
									isMultiple={true}
									limit={10}
									onChange={(values) => setSettingValue('currencies', values)}
									color={'blue'}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
function getCurrencyOptions(
	supported: SupportedCurrencies,
): { value: string; label: string }[] {
	return Object.keys(supported).map((key) => ({
		value: key,
		label: supported[key].label,
	}))
}

function getSelectedCurrencies(
	selected: string[],
	list: SupportedCurrencies,
): { value: string; label: string }[] {
	const keyes = Object.keys(list)

	return keyes
		.filter((key) => selected.includes(key))
		.map((key) => ({ value: key, label: list[key].label }))
}
