import { useEffect, useState } from 'react'
import { WeatherResponse } from '../../api/weather.interface'
import { extractMainColorFromImage } from '../../utils/colorUtils'

interface WeatherComponentProps {
  weather: WeatherResponse
  isDarkMode: boolean
}
export function WeatherComponent({
  weather,
  isDarkMode,
}: WeatherComponentProps) {
  const [iconColor, setIconColor] = useState('')
  const isActiveTransparent =
    document.body.classList.contains('transparent-active')

  useEffect(() => {
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
                isActiveTransparent && !isDarkMode
                  ? ''
                  : adjustColorBasedOnTheme(
                      iconColor,
                      isDarkMode ? 'dark' : 'light'
                    ),
            }}
          >
            <span className="text-3xl">
              {weather.weather.temperature.temp.toFixed(0)}
            </span>
            <sup className="font-[balooTamma] text-lg">°</sup>
          </div>
        </div>
      </div>
      <div className="flex flex-col  text-center text-gray-600 text-gray-trasnparent dark:text-[#eee] font-bold z-10">
        <div className="w-auto truncate font-normal text-center text-gray-600 text-gray-trasnparent dark:text-[#e7e4e4]">
          {weather.weather.temperature.temp_description}
        </div>
        <div className="flex flex-row mt-2 justify-around font-light rounded-md py-2 w-40">
          <div className="flex flex-col justify-center items-center">
            <div className="mb-2 h-5 overflow-clip">
              <img src="../assets/wind.png" width={20} height={20} />
            </div>
            <div dir="ltr">
              {weather.weather.temperature.wind_speed.toFixed(0)} <sup>k/h</sup>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="mb-2 h-5 overflow-clip">
              <img src="../assets/clouds.png" width={20} height={20} />
            </div>
            <div>{weather.weather.temperature.clouds.toFixed(0)}%</div>
          </div>
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
