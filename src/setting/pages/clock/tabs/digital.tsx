import { Checkbox, TabPanel, Typography } from '@material-tailwind/react'
import type { DigitalClockSettingStore } from 'electron/store'
import type { Timezone } from '../../../../api/api.interface'
import type { SetSettingValue } from '../clock.setting'

interface Prop {
	digital: DigitalClockSettingStore
	timezones: Timezone[]
	setSettingValue: SetSettingValue
}

export function DigitalClockTab({ digital, timezones, setSettingValue }: Prop) {
	return (
		<TabPanel key={'digital'} value={'digital'}>
			<Checkbox
				ripple={true}
				defaultChecked={digital?.showSecond}
				onClick={() =>
					setSettingValue('digital', {
						showSecond: !digital.showSecond,
					})
				}
				label={
					<div>
						<Typography
							variant={'h5'}
							color="blue-gray"
							className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir]"
						>
							نمایش ثانیه{' '}
							<span className="font-light">(نمایش ثانیه در ساعت)</span>
						</Typography>
					</div>
				}
				containerProps={{
					className: 'flex',
				}}
			/>
			<Checkbox
				ripple={true}
				defaultChecked={digital?.showTimeZone}
				onClick={() =>
					setSettingValue('digital', {
						showTimeZone: !digital.showTimeZone,
					})
				}
				label={
					<div>
						<Typography
							variant={'h5'}
							color="blue-gray"
							className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir]"
						>
							نمایش منطقه زمانی{' '}
							<span className="font-light">(نمایش منطقه زمانی در ساعت)</span>
						</Typography>
					</div>
				}
				containerProps={{
					className: 'flex',
				}}
			/>

			<Checkbox
				ripple={true}
				defaultChecked={digital?.autoUpdateColor}
				onClick={() =>
					setSettingValue('digital', {
						autoUpdateColor: !digital.autoUpdateColor,
					})
				}
				label={
					<div>
						<Typography
							variant={'h5'}
							color="blue-gray"
							className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir]"
						>
							رنگ بندی خودکار{' '}
							<span className="font-light">(تغییر رنگ در روز و شب)</span>
						</Typography>
					</div>
				}
				containerProps={{
					className: 'flex',
				}}
			/>

			<div
				className="flex flex-col w-full gap-2 mt-2 pb-10 font-[Vazir]"
				dir="rtl"
			>
				<label
					htmlFor="currency-select"
					className="text-gray-600 dark:text-[#eee] font-semibold"
				>
					انتخاب منطقه زمانی:
				</label>
				<select
					id="currency-select"
					className="form-select block w-80 mr-2 h-11 mt-1 text-gray-600 dark:text-[#eee] bg-white dark:bg-gray-800
                 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none
                focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 px-3"
					onChange={(e) =>
						setSettingValue('digital', {
							timeZone: getTimeZoneItem(timezones, e.target.value),
						})
					}
					value={digital?.timeZone.value}
					disabled={timezones.length === 0}
				>
					{timezones.map((timezone: Timezone, index) => (
						<option key={index} value={timezone.value} className="font-light">
							{timezone.label} ( {timezone.offset} )
						</option>
					))}
				</select>
			</div>
		</TabPanel>
	)
}

function getTimeZoneItem(timezoes: Timezone[], value: string) {
	return timezoes.find((timezone) => timezone.value === value)
}
