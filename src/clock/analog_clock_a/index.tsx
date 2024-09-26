import type { AnalogClockASettingStore } from 'electron/store'
import { AnalogClockComponent } from './analogClockA'

interface Prop {
	analog: AnalogClockASettingStore
}
export function AnalogClockA({ analog }: Prop) {
	return (
		<div className="flex flex-row justify-center items-center h-full flex-wrap gap-3 lg:gap-10">
			{analog?.timzones.map((timezone, index) => (
				<AnalogClockComponent
					key={index}
					timeZone={timezone.value}
					analogA={analog}
				/>
			))}
		</div>
	)
}
