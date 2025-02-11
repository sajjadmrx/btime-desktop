import ms from 'ms'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../shared/widgetKey'
import { getWeatherByLatLon, getWeatherForecastByLatLon } from '../api/api'
import type {
	ForecastResponse,
	WeatherResponse,
} from '../api/weather.interface'
import { WeatherComponent } from './components/weather-card.component'

function App() {
	const [weather, setWeather] = useState<WeatherResponse>(null)
	const [forecast, setForecast] = useState<ForecastResponse[]>([])
	const [weatherStore, setWeatherStore] = useState(
		window.store.get('Weather' as widgetKey.Weather),
	)
	const [isDarkMode, setIsDarkMode] = useState(
		window.matchMedia('(prefers-color-scheme: dark)').matches,
	)

	useEffect(() => {
		const handleColorSchemeChange = (e: MediaQueryListEvent) => {
			setIsDarkMode(e.matches)
			document.documentElement.classList.remove('dark')
			if (e.matches) {
				document.documentElement.classList.add('dark')
			}
		}

		const colorSchemeMediaQuery = window.matchMedia(
			'(prefers-color-scheme: dark)',
		)
		handleColorSchemeChange(
			colorSchemeMediaQuery as unknown as MediaQueryListEvent,
		)

		window.ipcRenderer.on('updated-setting', () => {
			const weatherSetting = window.store.get(widgetKey.Weather)
			setWeatherStore(weatherSetting)
		})

		colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)

		return () => {
			colorSchemeMediaQuery.removeEventListener(
				'change',
				handleColorSchemeChange,
			)
		}
	}, [])

	useEffect(() => {
		const fetchWeather = () => {
			getWeatherByLatLon(weatherStore.city.lat, weatherStore.city.lon)
				.then((data) => {
					if (!data) return
					setWeather(data)
				})
				.catch((error) => {
					console.error('Failed to fetch weather data:', error)
				})
		}
		if (weatherStore.city?.lat) fetchWeather() // Initial fetch

		const weatherInterval = setInterval(fetchWeather, ms('2h')) // Fetch weather every 2 hour

		return () => {
			clearInterval(weatherInterval)
		}
	}, [weatherStore])

	useEffect(() => {
		function fetch() {
			getWeatherForecastByLatLon(
				weatherStore.city.lat,
				weatherStore.city.lon,
			).then((data) => {
				setForecast([...new Set(data)])
			})
		}
		if (weather) {
			fetch()
		}

		return () => {}
	}, [weather, weatherStore.city?.lat, weatherStore.city?.lon])

	return (
		<div className="w-screen h-screen overflow-hidden">
			<div className="h-full px-0 moveable">
				<div className="flex flex-col items-center justify-around h-full">
					<div
						className="flex flex-col items-center justify-between w-full h-64 px-2 py-8 "
						dir="rtl"
					>
						{weather ? (
							<WeatherComponent
								weather={weather}
								isDarkMode={isDarkMode}
								forecast={forecast}
								weatherStore={weatherStore}
							/>
						) : weatherStore.city ? (
							<div className="flex flex-col items-center justify-center w-full h-64 text-gray-600 dark:text-[#eee] font-light text-center  rounded-md p-2">
								لطفا صبر کنید ...
							</div>
						) : (
							<div className="flex flex-col items-center justify-center w-full h-64 not-moveable">
								<div className="text-gray-600 dark:text-[#eee] font-light text-center dark:bg-gray-800/10 bg-gray-200/10 rounded-md p-2">
									لطفا در تنظیمات شهر مورد نظر خود را انتخاب کنید
								</div>
								<button
									className="px-4 py-2 mt-4 font-light text-white bg-blue-500 rounded cursor-pointer  hover:bg-blue-700"
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
