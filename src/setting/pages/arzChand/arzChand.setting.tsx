import { Checkbox, Slider, Switch, Typography } from '@material-tailwind/react'
import type { ArzChandSettingStore } from 'electron/store'
import { lazy, useEffect, useState } from 'react'
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
		}
	}

	function applyChanges() {
		window.store.set(widgetKey.ArzChand, {
			...setting,
			alwaysOnTop: setting.alwaysOnTop,
			enable: setting.enable,
			bounds: window.store.get(widgetKey.ArzChand).bounds,
			currencies: setting.currencies,
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
									className="text-gray-600  dark:text-[#c7c7c7] text-[13px] font-[Vazir] flex flex-row items-center mr-3"
								>
									فعال سازی
								</Typography>
								<Typography
									variant="h5"
									color="gray"
									className="dark:text-gray-500 text-gray-600 text-[12px] font-[Vazir] mr-3"
								>
									فعالسازی ویجت ویجی‌ارز(نمایش قیمت ارزها)
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
							قالب ها
						</label>
						<div className="flex mt-2 gap-2 w-full h-14 rounded-lg px-2 py-2 dark:bg-[#464545] bg-[#e8e6e6]">
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
								className="text-gray-600 dark:text-[#eee] font-semibold"
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
								<div>در حال بارگذاری...</div>
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
			className={`w-full h-10 flex justify-center items-center rounded-lg text-gray-600 dark:text-[#eee] cursor-pointer ${
				selected
					? 'bg-[#f5f5f5] dark:bg-[#3a3a3a]'
					: 'hover:bg-[#f5f5f578] dark:hover:bg-[#3a3a3a5c]'
			} 
        ${selected && 'text-gray-600 dark:text-gray-300'}
        transition-all  ease-in-out duration-2000`}
		>
			{title}
		</div>
	)
}
