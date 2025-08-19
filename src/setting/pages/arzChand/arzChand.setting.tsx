import { Checkbox, Slider, Switch, Typography } from '@material-tailwind/react'
import type { ArzChandSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../../../shared/widgetKey'
import {
	type SupportedCurrencies,
	getSupportedCurrencies,
} from '../../../api/api'
import { MultiSelectDropdown } from '../../components/multiSelectDropdown.component'

export function ArzChandSetting() {
	const [setting, setSetting] = useState<ArzChandSettingStore>(null)
	const [supportedCurrencies, setSupportedCurrencies] =
		useState<SupportedCurrencies>([])

	useEffect(() => {
		const ArzChand: ArzChandSettingStore = window.store.get(widgetKey.ArzChand)
		ArzChand.borderRadius = ArzChand.borderRadius || 28
		setSetting(ArzChand)

		function fetchSupportedCurrencies() {
			getSupportedCurrencies().then((data) => {
				setSupportedCurrencies([])
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

		if (key === 'enable') {
			window.ipcRenderer.send('toggle-enable', widgetKey.ArzChand)
		} else if (!['borderRadius'].includes(key)) {
			window.ipcRenderer.send('updated-setting', widgetKey.ArzChand)
		}
	}

	function applyChanges() {
		window.store.set(widgetKey.ArzChand, {
			...setting,
			alwaysOnTop: setting.alwaysOnTop,
			enable: setting.enable,
			bounds: window.store.get(widgetKey.ArzChand).bounds,
			currencies: setting.currencies,
			borderRadius: setting.borderRadius,
		})
	}

	if (!setting) return null
	return (
		<>
			<div className="p-2 mt-2 h-full not-moveable font-[Vazir] overflow-y-scroll custom-scrollbar">
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
									className="text-content text-[13px] font-[Vazir] flex flex-row items-center mr-3"
								>
									فعال سازی
								</Typography>
								<Typography
									variant="h5"
									color="gray"
									className="text-muted text-xs font-[Vazir] mr-3"
								>
									فعالسازی ویجت ویجی‌ارز{' '}
									<span className="font-light">(نمایش قیمت ارزها)</span>
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
										className="text-content text-[13px] font-[Vazir]"
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
						<label className="text-sm font-semibold text-content">
							قالب ها
						</label>
						<div className="flex w-full gap-2 px-2 py-2 mt-2 rounded-lg h-14 bg-content">
							<TemplateItem
								title={'پیشفرض'}
								selected={setting.template === 'default' || !setting.template}
								onClick={() => setSettingValue('template', 'default')}
							/>
							<TemplateItem
								title={'کلاسیک'}
								selected={setting.template === 'classic'}
								onClick={() => setSettingValue('template', 'classic')}
							/>
						</div>
					</div>

					<div
						className="flex flex-row items-center justify-between w-full gap-2"
						dir="rtl"
					>
						<div
							className="flex flex-col justify-between gap-2 w-96 "
							dir="rtl"
						>
							<label
								htmlFor="currency-select"
								className="font-semibold text-content"
							>
								انتخاب ارز:
							</label>
							{supportedCurrencies.length ? (
								<MultiSelectDropdown
									options={getCurrencyOptions(supportedCurrencies) as any}
									values={getSelectedCurrencies(
										setting.currencies,
										supportedCurrencies,
									)}
									isMultiple={true}
									limit={10}
									onChange={(values) => setSettingValue('currencies', values)}
									color={'blue'}
								/>
							) : (
								<div className="text-muted">در حال بارگذاری...</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

interface Option {
	label: string
	options: {
		value: string
		label: string
	}[]
}
function getCurrencyOptions(supported: SupportedCurrencies): Option[] {
	const keys = Object.keys(supported)

	const isCrypto = keys.filter((key) => supported[key].type === 'crypto')
	const isCurrency = keys.filter((key) => supported[key].type === 'currency')
	const supportedCoins = keys.filter((key) => supported[key].type === 'coin')

	const options = [
		{
			label: '🪙 ارزهای دیجیتال',
			options: isCrypto.map((indx) => ({
				value: supported[indx].key,
				label: supported[indx].label.fa,
			})),
		},
		{
			label: '💵 ارزها',
			options: isCurrency.map((key) => ({
				value: supported[key].key,
				label: supported[key].label.fa,
			})),
		},
		{
			label: '🥇 طلا و سکه',
			options: supportedCoins.map((indx) => ({
				value: supported[indx].key,
				label: supported[indx].label.fa,
			})),
		},
	]

	return options
}

function getSelectedCurrencies(
	selected: string[],
	list: SupportedCurrencies,
): { value: string; label: string }[] {
	return selected.map((key) => ({
		value: key,
		// biome-ignore lint/suspicious/noDoubleEquals: <explanation>
		label: list.find((item) => item.key == key)?.label?.fa,
	}))
}

function TemplateItem({ title, selected, onClick }) {
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
