import { useEffect, useState } from 'react'
import { ForecastResponse, WeatherResponse } from '../../api/weather.interface'
import { extractMainColorFromImage } from '../../utils/colorUtils'

interface WeatherComponentProps {
  weather: WeatherResponse
  forecast: ForecastResponse[]
  isDarkMode: boolean
}
export function WeatherComponent({
  weather,
  isDarkMode,
  forecast,
}: WeatherComponentProps) {
  const [iconColor, setIconColor] = useState('')
  const [isTransparent, setIsTransparent] = useState(
    document.body.classList.contains('transparent-active')
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsTransparent(document.body.classList.contains('transparent-active'))
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    console.log(forecast)
    if (weather) {
      extractMainColorFromImage(weather.weather.icon.url).then((color) => {
        setIconColor(color)
      })
    }
  }, [weather])

  return (
    <div className="flex flex-col items-center justify-around w-full px-2 h-64 relative">
      <div className="flex flex-row justify-around items-center w-full z-10">
        <div className="flex-1 h-14 flex justify-center items-center overflow-clip">
          <img
            src={weather.weather.icon.url}
            width={weather.weather.icon.width}
            height={weather.weather.icon.height}
            alt={`${weather.weather.label} ایکون`}
          />
        </div>
        <div className="flex-1 text-2xl w-20 text-center truncate mt-1 relative">
          <div
            className="z-10 text-gray-trasnparent dark:text-[#eee]"
            style={{
              color:
                isTransparent && !isDarkMode
                  ? ''
                  : adjustColorBasedOnTheme(
                      iconColor,
                      isDarkMode ? 'dark' : 'light'
                    ),
            }}
          >
            <span className="text-3xl">
              {Math.floor(weather.weather.temperature.temp)}
            </span>
            <sup className="font-[balooTamma] text-lg">°</sup>
          </div>
        </div>
      </div>
      <div className="flex flex-col  text-center text-gray-600 text-gray-trasnparent dark:text-[#eee] font-bold z-10">
        <div className="w-auto truncate font-normal text-center text-gray-600 text-gray-trasnparent dark:text-[#e7e4e4] xs:text-xs sm:text-sm">
          {weather.weather.temperature.temp_description}
        </div>
        <div className="flex flex-row mt-2 justify-around font-light rounded-md py-2 xs:w-40 sm:w-52 md:w-80 lg:w-96 ">
          {forecast.map((item, index) => {
            return <ForecastComponent weather={item} key={index} />
          })}
        </div>
      </div>

      <div
        className="w-full h-24 absolute z-0 -bottom-10 blur-2xl opacity-50 dark:opacity-30"
        style={{
          background: `linear-gradient(to bottom, ${iconColor} 0%, ${iconColor + '00'} 0%, ${iconColor} 100%)`,
        }}
      ></div>
    </div>
  )
}
interface ForecastComponentProps {
  weather: {
    temp: number
    icon: string
    date: string
  }
}
function ForecastComponent({ weather }: ForecastComponentProps) {
  const time = weather.date.split(' ')[1]
  const h = time.split(':')[0]
  const m = time.split(':')[1]
  return (
    <div className="flex flex-col items-center justify-around w-full  h-10 gap-1 p-1 sm:h-12 sm:w-16 md:h-20 md:px-4 md:w-full  lg:h-16 lg:w-60">
      <p className="xs:text-[.60rem] sm:text-[.70rem] md:text-[.90rem] lg:text-[.90rem] xs:w-10 sm:w-14">
        {h}:{m}
      </p>
      <img
        src={weather.icon}
        className="xs:w-4 xs:h-4 sm:w-6 sm:h-6 md:w-8 md:h-w-8 lg:w-10 lg:h-10"
      />
      <p className="text-[.80rem] w-10">
        {weather.temp.toFixed(0)}
        <sup className="font-[balooTamma] text-[.50rem]">°</sup>
      </p>
    </div>
  )
}

function adjustColorBasedOnTheme(hexColor: string, theme: string) {
  // Generate color based on theme with color
  if (theme === 'light') {
    return hexColor
  }

  // Convert hex to RGB
  const color = hexColor.replace('#', '')
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)

  // Darken the color for the dark theme
  const factor = 3.7 // Adjust this factor to control the darkness
  const darken = (value: number) =>
    Math.max(0, Math.min(255, Math.floor(value * factor + 70)))

  const darkR = darken(r)
  const darkG = darken(g)
  const darkB = darken(b)

  // Convert RGB back to hex
  const toHex = (value: number) => value.toString(16).padStart(2, '0')
  const darkHexColor = `#${toHex(darkR)}${toHex(darkG)}${toHex(darkB)}`

  return darkHexColor
}
