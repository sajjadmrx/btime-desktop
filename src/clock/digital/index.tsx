import type { DigitalClockSettingStore } from 'electron/store'
import moment from 'jalali-moment'
import { useEffect, useRef } from 'react'
interface Prop {
	digital: DigitalClockSettingStore
}
export function DigitalClock({ digital }: Prop) {
	const timeRef = useRef(null)
	const dateRef = useRef(null)

	useEffect(() => {
		const updateClock = () => {
			const now = new Date()
			const options: Intl.DateTimeFormatOptions = {
				timeZone: digital?.timeZone?.value || 'Asia/Tehran',
				hour12: false,
				hour: 'numeric',
				minute: '2-digit',
			}

			if (digital?.showSecond) {
				options.second = '2-digit'
			}

			let timeString = new Intl.DateTimeFormat('en-US', options).format(now)

			const [hours, ...rest] = timeString.split(':')
			const formattedHours = hours === '24' ? '00' : hours.padStart(2, '0')
			timeString = [formattedHours, ...rest].join(':')

			if (timeRef.current) {
				timeRef.current.textContent = timeString
			}

			if (
				now.getHours() === 0 &&
				now.getMinutes() === 0 &&
				now.getSeconds() === 0
			) {
				dateRef.current.textContent = moment()
					.locale('fa')
					.format('dddd jD jMMMM jYYYY')
			}
		}

		updateClock()

		const timerId = setInterval(updateClock, 1000)
		return () => clearInterval(timerId)
	}, [digital])

	return (
		<div className="flex h-full items-center text-center justify-center px-2">
			<div className="text-6xl flex-col font-bold text-gray-600 text-gray-trasnparent dark:text-[#eee] font-mono relative w-60 overflow-clip px-2 font-[digital7]">
				<div ref={timeRef}>00:00:00</div>
				<div
					className={'font-[vazir] text-sm flex flex-col gap-1'}
					ref={dateRef}
				>
					<div>
						{digital?.showTimeZone && <span>{digital?.timeZone?.label}</span>}
					</div>
					<div>
						{digital?.showDate &&
							moment().locale('fa').format('dddd jD jMMMM jYYYY')}
					</div>
				</div>
			</div>
		</div>
	)
}
