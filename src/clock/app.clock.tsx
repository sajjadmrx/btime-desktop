import { useEffect, useState } from 'react'
import { widgetKey } from '../../shared/widgetKey'
import type { ClockSettingStore } from '../../electron/store'
import { DigitalClock } from './digital'
import { AnalogClockA } from './analog_clock_a'

function App() {
	const [setting, setSetting] = useState<ClockSettingStore>(
		window.store.get(widgetKey.Clock),
	)

	useEffect(() => {
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

	return (
		<div className="h-screen w-screen overflow-hidden">
			<div className="moveable px-0 h-full">
				{setting.currentClock === 'digital' ? (
					<DigitalClock digital={setting.digital} />
				) : (
					<AnalogClockA analog={setting.analogA} />
				)}
			</div>
		</div>
	)
}

export default App
