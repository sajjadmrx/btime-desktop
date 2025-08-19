import { useEffect, useState } from 'react'

import type { BtimeSettingStore } from '../../electron/store'
import { widgetKey } from '../../shared/widgetKey'
import { AuthProvider } from '../context/auth.context'
import { useAnalytics } from '../hooks/useAnalytics'
import { useThemeMode } from '../hooks/useTheme'
import { DateProvider } from './context/date.context'
import { DayEventsComponent } from './dayEvents/dayEvents'
import { GregorianComponent } from './gregorian'
import { JalaliComponent } from './jalali'

function App() {
	const [widgetSetting, setWidgetSetting] = useState<BtimeSettingStore>(
		window.store.get(widgetKey.BTime),
	)

	useEffect(() => {
		window.ipcRenderer.on('updated-setting', () => {
			setWidgetSetting(window.store.get(widgetKey.BTime))
		})
	}, [])

	useThemeMode()
	useAnalytics('calendar')

	return (
		<>
			<DateProvider>
				<div className="w-screen h-screen overflow-hidden">
					<div className="flex flex-col h-screen overflow-hidden">
						{widgetSetting && widgetSetting.currentCalender === 'Gregorian' ? (
							<GregorianComponent setting={widgetSetting} />
						) : (
							<JalaliComponent setting={widgetSetting} />
						)}
						{widgetSetting.showCalendar && (
							<AuthProvider>
								<div className="relative">
									<DayEventsComponent />
								</div>
							</AuthProvider>
						)}
					</div>
				</div>
			</DateProvider>
		</>
	)
}

export default App
