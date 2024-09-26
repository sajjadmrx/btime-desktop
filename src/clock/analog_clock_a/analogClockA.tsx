import { useEffect, useState } from 'react'
import type { AnalogClockASettingStore } from '../../../electron/store'

interface ClockProps {
	timeZone: string
	analogA: AnalogClockASettingStore
}

export const AnalogClockComponent = ({ timeZone, analogA }: ClockProps) => {
	const [time, setTime] = useState(new Date())

	useEffect(() => {
		function updateTime() {
			setTime(new Date(new Date().toLocaleString('en-US', { timeZone })))
		}

		updateTime() // Initial call to set the time immediately
		const interval = setInterval(updateTime, 1000)

		return () => clearInterval(interval)
	}, [timeZone])

	const hour = time.getHours()
	const minute = time.getMinutes()
	const second = time.getSeconds()

	const hourDegrees = (hour % 12) * 30 + minute * 0.5
	const minuteDegrees = minute * 6
	const secondDegrees = second * 6

	const hourMarkers = Array.from({ length: 12 }, (_, i) => i + 1)

	return (
		<div
			className="relative w-32 h-32 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center items-center
		dark:bg-gray-800 bg-gray-100"
		>
			{hourMarkers.map((marker, index) => {
				const angle = (index + 1) * 30
				const radius = 45
				const x = radius * Math.cos((angle - 90) * (Math.PI / 180))
				const y = radius * Math.sin((angle - 90) * (Math.PI / 180))

				const _marker = analogA?.showAllHours ? (
					marker
				) : marker % 3 === 0 ? (
					marker
				) : (
					<div className="w-1 h-1 bg-gray-700 rounded-full" />
				)

				return (
					<div
						key={marker}
						className="absolute dark:text-gray-300/60 text-gray-700 text-xs font-[balooTamma]"
						style={{
							left: `calc(50% + ${x}px)`,
							top: `calc(50% + ${y}px)`,
							transform: 'translate(-50%, -50%)',
						}}
					>
						{_marker}
					</div>
				)
			})}

			<div className="absolute  rounded-full origin-bottom z-40">
				<div
					className="absolute -right-[2px] -top-[33px] w-1 h-8 bg-gray-700 rounded-full origin-bottom"
					style={{ transform: `rotate(${hourDegrees}deg)` }}
				/>
			</div>

			<div className="absolute  rounded-full origin-bottom z-40">
				<div
					className="absolute -right-[2px] -top-[36px] w-1 h-9 bg-red-500 rounded-full origin-bottom transition-transform duration-1000"
					style={{ transform: `rotate(${secondDegrees}deg)` }}
				/>
			</div>

			<div className="absolute w-3 h-3 bg-gray-700 rounded-full z-50" />
			<div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-gray-500 opacity-55 ">
				{analogA.showTimeZone && getTimeZoneLabel(timeZone)}
			</div>
		</div>
	)
}

function getTimeZoneLabel(timezone: string): string {
	if (timezone.length === 3) {
		return timezone
	}

	if (timezone.split('/')[1]) {
		return timezone.split('/')[1].replace('_', ' ').toUpperCase().slice(0, 3)
	}

	return timezone
}
