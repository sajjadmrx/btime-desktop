import { useEffect, useRef, useState } from 'react'
import moment from 'jalali-moment'
import { widgetKey } from '../../shared/widgetKey'
import type { ClockSettingStore } from '../../electron/store'

function App() {
	const timeRef = useRef(null)
	const dateRef = useRef(null)

	const [setting, setSetting] = useState<ClockSettingStore>(null)

	useEffect(() => {
		setSetting(window.store.get(widgetKey.Clock))
		const handleColorSchemeChange = (e) => {
			document.documentElement.classList.remove('dark')
			if (e.matches) {
				document.documentElement.classList.add('dark')
			}
		}

		const colorSchemeMediaQuery = window.matchMedia(
			'(prefers-color-scheme: dark)',
		)

		window.ipcRenderer.on('updated-setting', () => {
			setSetting(window.store.get(widgetKey.Clock))
		})

		handleColorSchemeChange(colorSchemeMediaQuery)

		document.body.classList.add('transparent-active')

		colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)

		return () => {
			colorSchemeMediaQuery.removeEventListener(
				'change',
				handleColorSchemeChange,
			)

			window.ipcRenderer.removeListener('updated-setting', () => {
				setSetting(window.store.get(widgetKey.Clock))
			})
		}
	}, [])

	useEffect(() => {
		const updateClock = () => {
			const now = new Date()
			const options: Intl.DateTimeFormatOptions = {
				timeZone: setting?.timeZone?.value || 'Asia/Tehran',
				hour12: false,
				hour: 'numeric',
				minute: '2-digit',
			}

			if (setting?.showSecond) {
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

		if (setting?.enable) {
			updateClock()

			const timerId = setInterval(updateClock, 1000)
			return () => clearInterval(timerId)
		}
	}, [setting])
	return (
		<div className="h-screen w-screen overflow-hidden bg-[#33333330]">
			<div className="moveable px-0 h-full">
				<div className="flex h-full items-center text-center justify-center px-2">
					<div className="text-6xl flex-col font-bold text-gray-600 text-gray-trasnparent dark:text-[#eee] font-mono relative w-60 overflow-clip px-2 font-[digital7]">
						<div ref={timeRef}>00:00:00</div>
						<div
							className={'font-[vazir] text-sm flex flex-col gap-1'}
							ref={dateRef}
						>
							<div>
								{setting?.showTimeZone && (
									<span>{setting?.timeZone?.label}</span>
								)}
							</div>
							<div>
								{setting?.showDate &&
									moment().locale('fa').format('dddd jD jMMMM jYYYY')}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default App
