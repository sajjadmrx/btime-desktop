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
	const [refreshTrigger, setRefreshTrigger] = useState(0)

	useEffect(() => {
		window.ipcRenderer.on('updated-setting', () => {
			setWidgetSetting(window.store.get(widgetKey.BTime))
		})
	}, [])

	useThemeMode()
	const handleRefetch = () => {
		setRefreshTrigger((prev) => prev + 1)
	}

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
									<button
										onClick={handleRefetch}
										className="absolute top-2 left-2 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm z-10"
										title="بروزرسانی رویدادها"
									>
										<FiRefreshCw size={16} />
									</button>
									<DayEventsComponent refreshTrigger={refreshTrigger} />
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
