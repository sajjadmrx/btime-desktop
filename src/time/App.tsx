import { useEffect, useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import type { BtimeSettingStore } from '../../electron/store'
import { widgetKey } from '../../shared/widgetKey'
import { AuthProvider } from '../context/auth.context'
import { useThemeMode } from '../hooks/useTheme'
import { DateProvider } from './context/date.context'
import { DayEventsComponent } from './dayEvents/dayEvents'
import { GregorianComponent } from './gregorian'
import { JalaliComponent } from './jalali'

function App() {
	const [widgetSetting, setWidgetSetting] = useState<BtimeSettingStore>(
		window.store.get(widgetKey.BTime),
	)
	const [dayEventsLoading, setDayEventsLoading] = useState(false)

	useEffect(() => {
		window.ipcRenderer.on('updated-setting', () => {
			setWidgetSetting(window.store.get(widgetKey.BTime))
		})
	}, [])

	useThemeMode()

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
									<DayEventsComponent
										onLoadingStateChange={setDayEventsLoading}
									/>
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
