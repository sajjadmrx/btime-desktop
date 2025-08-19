import type { DigitalClockSettingStore } from 'electron/store'
import moment from 'jalali-moment'
import { useEffect, useRef, useState } from 'react'
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
		<div className="flex items-center justify-center h-full px-2 text-center">
			<div
				className={
					'flex flex-col text-6xl font-bold font-mono relative w-60 overflow-hidden justify-center items-center font-[digital7] text-content'
				}
			>
				<div
					ref={timeRef}
					className="w-full text-center tabular-nums"
					style={{
						minWidth: digital?.showSecond ? '180px' : '120px',
						letterSpacing: '0.025em',
					}}
				>
					00:00:00
				</div>
				<div
					className={
						'font-[vazir] text-sm flex flex-col gap-1 w-full text-center'
					}
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
