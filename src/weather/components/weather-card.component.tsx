import { useEffect, useState } from 'react'
import { WeatherResponse } from '../../api/weather.interface'
import { extractMainColorFromImage } from '../../utils/colorUtils'

interface WeatherComponentProps {
  weather: WeatherResponse
  iconColor: string
}
export function WeatherComponent({ weather }: WeatherComponentProps) {
  const [iconColor, setIconColor] = useState('')
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
        <div className="flex-1 text-2xl w-20 text-center truncate text-gray-600 text-gray-trasnparent dark:text-[#eee] mt-1">
          <span className="text-3xl">
            {weather.weather.temperature.temp.toFixed(0)}
          </span>
          <sup className="font-[balooTamma]">°</sup>
        </div>
      </div>
      <div className="flex flex-col  text-center text-gray-600 text-gray-trasnparent dark:text-[#eee] font-bold z-10">
        <div className="w-auto truncate font-light text-center">
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
        className="w-full h-24 absolute z-0 -bottom-10 blur-3xl opacity-50 dark:opacity-30"
        style={{
          background: `linear-gradient(to bottom, ${iconColor} 0%, ${iconColor + '00'} 0%, ${iconColor} 95%)`,
        }}
      ></div>
    </div>
  )
}
