import ms from 'ms'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../shared/widgetKey'
import { useGetWeatherByLatLon } from '../api/hooks/weather/getWeatherByLatLon'
import { WeatherLayout } from './layout/weather-layout'

function App() {
	const [weatherStore, setWeatherStore] = useState(
		window.store.get('Weather' as widgetKey.Weather),
	)
	const [isDarkMode, setIsDarkMode] = useState(
		window.matchMedia('(prefers-color-scheme: dark)').matches,
	)

	const [isTransparent, setIsTransparent] = useState(false)
	const [isBackgroundActive, setBackgroundActive] = useState<boolean>(true)

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

		const isContainClass = (className: string) => {
			const element = document.querySelector('.h-screen')
			if (!element) return false
			return element.classList.contains(className)
		}

		setIsTransparent(isContainClass('transparent-active'))

		const observer = new MutationObserver(() => {
			setIsTransparent(isContainClass('transparent-active'))
		})

		const observerBackground = new MutationObserver(() => {
			setBackgroundActive(isContainClass('background'))
		})

		if (document.querySelector('.h-screen'))
			observer.observe(document.querySelector('.h-screen'), {
				attributes: true,
				attributeFilter: ['class'],
			})

		if (document.querySelector('.h-screen'))
			observerBackground.observe(document.querySelector('.h-screen'), {
				attributes: true,
				attributeFilter: ['class'],
			})

		return () => {
			colorSchemeMediaQuery.removeEventListener(
				'change',
				handleColorSchemeChange,
			)
			observer.disconnect()
			observerBackground.disconnect()
		}
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
				<div className="flex flex-col items-center justify-around h-full">
					<div
						className="flex flex-col items-center justify-between w-full h-64 px-2 py-8"
						dir="rtl"
					>
						{weather && isSuccess ? (
							<WeatherLayout
								isDarkMode={isDarkMode}
								weatherData={weather}
								weatherStore={weatherStore}
								isTransparent={isTransparent}
								isBackgroundActive={isBackgroundActive}
							/>
						) : weatherStore.city ? (
							<WeatherSkeleton />
						) : (
							<div className="flex flex-col items-center justify-center w-full h-64 not-moveable">
								<div className="text-gray-600 dark:text-[#eee] font-light text-center dark:bg-gray-800/10 bg-gray-200/10 rounded-md p-2">
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
