import ms from 'ms'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../shared/widgetKey'
import { useGetWeatherByLatLon } from '../api/hooks/weather/getWeatherByLatLon'
import { useThemeMode } from '../hooks/useTheme'
import { WeatherLayout } from './layout/weather-layout'

function App() {
	const [weatherStore, setWeatherStore] = useState(
		window.store.get('Weather' as widgetKey.Weather),
	)

	useThemeMode()

	useEffect(() => {
		window.ipcRenderer.on('updated-setting', () => {
			const weatherSetting = window.store.get(widgetKey.Weather)
			setWeatherStore(weatherSetting)
		})
	}, [])

	const { data: weather, isSuccess } = useGetWeatherByLatLon(
		weatherStore.city?.lat,
		weatherStore.city?.lon,
		{
			refetchInterval: ms('2h'),
		},
	)

	const WeatherSkeleton = () => (
		<div className="flex flex-col items-center justify-center w-full h-64 animate-pulse">
			<div className="w-32 h-6 mb-4 rounded-md bg-gray-200/60 dark:bg-gray-700/40"></div>

			<div className="w-20 h-12 mb-2 rounded-md bg-gray-200/60 dark:bg-gray-700/40"></div>

			<div className="w-24 h-6 mb-4 rounded-md bg-gray-200/60 dark:bg-gray-700/40"></div>

			<div className="flex space-x-4 rtl:space-x-reverse">
				<div className="w-16 h-5 rounded-md bg-gray-200/60 dark:bg-gray-700/40"></div>
				<div className="w-16 h-5 rounded-md bg-gray-200/60 dark:bg-gray-700/40"></div>
			</div>
		</div>
	)

	return (
		<div className="w-screen h-screen overflow-hidden">
			<div className="h-full px-0 moveable">
				<div className="flex flex-col items-center justify-around">
					<div
						className="flex flex-col items-center justify-between w-full"
						dir="rtl"
					>
						{weather && isSuccess ? (
							<WeatherLayout
								weatherData={weather}
								weatherStore={weatherStore}
							/>
						) : weatherStore.city ? (
							<WeatherSkeleton />
						) : (
							<div className="flex flex-col items-center justify-center w-full h-64 not-moveable">
								<div className="p-2 font-light text-center rounded-md text-content dark:bg-gray-800/10 bg-gray-200/10">
									لطفا در تنظیمات شهر مورد نظر خود را انتخاب کنید
								</div>
								<button
									className="px-4 py-2 mt-4 font-light text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-700"
									onClick={() => window.ipcMain.openSettingWindow()}
								>
									تنظیمات
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default App
