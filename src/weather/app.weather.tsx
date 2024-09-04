import { useEffect, useState } from 'react'
import { getWeatherByLatLon, getWeatherForecastByLatLon } from '../api/api'
import { ForecastResponse, WeatherResponse } from '../api/weather.interface'
import ms from 'ms'
import { WeatherComponent } from './components/weather-card.component'
import { widgetKey } from '../../shared/widgetKey'

function App() {
  const [weather, setWeather] = useState<WeatherResponse>(null)
  const [forecast, setForecast] = useState<ForecastResponse[]>([])
  const weatherStore = window.store.get('Weather' as widgetKey.Weather)
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
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
      '(prefers-color-scheme: dark)'
    )
    handleColorSchemeChange(
      colorSchemeMediaQuery as unknown as MediaQueryListEvent
    )

    colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)

    return () => {
      colorSchemeMediaQuery.removeEventListener(
        'change',
        handleColorSchemeChange
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
    if (weatherStore.city && weatherStore.city.lat) fetchWeather() // Initial fetch

    const weatherInterval = setInterval(fetchWeather, ms('2h')) // Fetch weather every 2 hour

    return () => {
      clearInterval(weatherInterval)
    }
  }, [])

  useEffect(() => {
    function fetch() {
      getWeatherForecastByLatLon(
        weatherStore.city.lat,
        weatherStore.city.lon
      ).then((data) => {
        setForecast([...new Set(data)])
      })
    }
    if (weather) {
      fetch()
    }

    return () => {}
  }, [weather])

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="moveable px-0 h-full">
        <div className="flex flex-col  h-full justify-around items-center">
          <div
            className=" flex flex-col items-center py-8 justify-between w-full px-2  h-64"
            dir="rtl"
          >
            {weather ? (
              <WeatherComponent
                weather={weather}
                isDarkMode={isDarkMode}
                forecast={forecast}
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
                  className=" mt-4 bg-blue-500 hover:bg-blue-700 text-white font-light py-2 px-4 rounded cursor-pointer"
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
