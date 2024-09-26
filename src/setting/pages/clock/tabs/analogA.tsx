import { Checkbox, TabPanel, Typography } from '@material-tailwind/react'
import type { AnalogClockASettingStore } from 'electron/store'
import type { Timezone } from '../../../../api/api.interface'
import { MultiSelectDropdown } from '../../../components/multiSelectDropdown.component'
import type { SetSettingValue } from '../clock.setting'

interface Prop {
	analog: AnalogClockASettingStore
	timezones: Timezone[]
	setSettingValue: SetSettingValue
}

export function AnalogAClockTab({ analog, timezones, setSettingValue }: Prop) {
	return (
		<TabPanel key={'analog'} value={'analogA'}>
			<Checkbox
				ripple={true}
				defaultChecked={analog?.showAllHours}
				onClick={() =>
					setSettingValue('analogA', {
						showAllHours: !analog.showAllHours,
					})
				}
				label={
					<div>
						<Typography
							variant={'h5'}
							color="blue-gray"
							className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir]"
						>
							نمایش تمام ساعات{' '}
							<span className="font-light">(نمایش تمام ساعات در ساعت)</span>
						</Typography>
					</div>
				}
				containerProps={{
					className: 'flex',
				}}
			/>
			<Checkbox
				ripple={true}
				defaultChecked={analog?.showTimeZone}
				onClick={() =>
					setSettingValue('analogA', {
						showTimeZone: !analog.showTimeZone,
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

			<div className="flex flex-col w-full gap-2 mt-2  font-[Vazir]" dir="rtl">
				<label
					htmlFor="currency-select"
					className="text-gray-600 dark:text-[#eee] font-semibold"
				>
					انتخاب مناطق زمانی:
				</label>
				<MultiSelectDropdown
					options={timezones.map((timezone) => ({
						value: timezone.value,
						label: timezone.label || '',
					}))}
					values={analog?.timzones || []}
					isMultiple={true}
					limit={10}
					onChange={(values) =>
						setSettingValue('analogA', {
							timzones: values.map((value) => findTimeZone(timezones, value)),
						})
					}
					color={'blue'}
				/>
			</div>
		</TabPanel>
	)
}
function findTimeZone(timezones: Timezone[], value: string) {
	return timezones.find((timezone) => timezone.value === value)
}
