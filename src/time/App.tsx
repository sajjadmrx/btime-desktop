import moment from 'jalali-moment'
import ms from 'ms'
import { useEffect, useState } from 'react'
import { useGetEvents } from 'src/api/hooks/events/getEvents.hook'
import type { BtimeSettingStore } from '../../electron/store'
import { widgetKey } from '../../shared/widgetKey'
import { DayEventsComponent } from './dayEvents/dayEvents'
import { GregorianComponent } from './gregorian'
import { JalaliComponent } from './jalali'

function App() {
	const [widgetSetting, setWidgetSetting] = useState<BtimeSettingStore>(
		window.store.get(widgetKey.BTime),
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
		handleColorSchemeChange(colorSchemeMediaQuery)

		window.ipcRenderer.on('updated-setting', () => {
			setWidgetSetting(window.store.get(widgetKey.BTime))
		})

		colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)

		return () => {
			colorSchemeMediaQuery.removeEventListener(
				'change',
				handleColorSchemeChange,
			)
		}
	}, [])

	return (
		<>
			<div className="w-screen h-screen overflow-hidden">
				<div className="flex flex-col h-screen overflow-hidden">
					{widgetSetting && widgetSetting.currentCalender === 'Gregorian' ? (
						<GregorianComponent setting={widgetSetting} />
					) : (
						<JalaliComponent setting={widgetSetting} />
					)}
					{widgetSetting.showCalendar && <DayEventsComponent />}
				</div>
			</div>
		</>
	)
}

export default App
