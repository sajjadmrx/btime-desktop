import { useEffect, useState } from 'react'
import type { ClockSettingStore } from '../../electron/store'
import { widgetKey } from '../../shared/widgetKey'
import { useThemeMode } from '../hooks/useTheme'
import { AnalogClockA } from './analog_clock_a'
import { DigitalClock } from './digital'

function App() {
	const [setting, setSetting] = useState<ClockSettingStore>(
		window.store.get(widgetKey.Clock),
	)

	useEffect(() => {
		window.ipcRenderer.on('updated-setting', () => {
			setSetting(window.store.get(widgetKey.Clock))
		})
	}, [])

	useThemeMode()

	return (
		<div className="w-screen h-screen overflow-hidden">
			<div className="h-full px-0 moveable">
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
