import { useEffect, useState } from 'react'
import type { WeatherSettingStore } from '../../../electron/store'
import type { FetchedWeather } from '../../api/hooks/weather/weather.interface'
import { extractMainColorFromImage } from '../../utils/colorUtils'
import { ForecastComponent } from '../components/forecast.component'

interface WeatherComponentProps {
	isDarkMode: boolean
	weatherStore: WeatherSettingStore
	weatherData: FetchedWeather
	isTransparent: boolean
	isBackgroundActive: boolean
}
export function WeatherLayout({
	isDarkMode,
	weatherStore,
	isBackgroundActive,
	isTransparent,
	weatherData,
}: WeatherComponentProps) {
	const [iconColor, setIconColor] = useState('')

	let textColor = 'text-gray-600 text-gray-trasnparent dark:text-[#d3d3d3]'
	if (isTransparent || !isBackgroundActive) {
		textColor = 'text-gray-300'
	}

	useEffect(() => {
		if (weatherData && weatherStore.stateColor) {
			extractMainColorFromImage(weatherData.weather.icon.url).then((color) => {
				setIconColor(color)
			})
		}
	}, [weatherData, weatherStore.stateColor])

	return (
		<div className="relative flex flex-col items-center justify-around w-full h-64 px-2">
			<div className="z-10 flex flex-row items-center justify-around w-full">
				<div className="flex items-center justify-center flex-1 h-14 overflow-clip">
					<img
						src={weatherData.weather.icon.url}
						width={weatherData.weather.icon.width}
						height={weatherData.weather.icon.height}
						alt={`${weatherData.weather.label} ایکون`}
					/>
				</div>
				<div className="relative flex-1 w-20 mt-1 text-2xl text-center truncate">
					<div
						className="z-10 text-gray-trasnparent dark:text-[#eee]"
						style={{
							color:
								isTransparent && !isDarkMode
									? ''
									: getMainColorFromImage(
											iconColor,
											isDarkMode ? 'dark' : 'light',
										),
						}}
					>
						<span className="text-3xl">
							{Math.floor(weatherData.weather.temperature.temp)}
						</span>
						<sup className="font-[balooTamma] text-lg">°</sup>
					</div>
				</div>
			</div>
			<div className="z-10 flex flex-col font-bold text-center">
				<div
					className={`w-auto truncate font-normal text-center xs:text-xs sm:text-sm ${textColor}`}
				>
					{weatherData.weather.temperature.temp_description}
				</div>
				<div className="flex flex-row justify-around py-2 mt-2 font-light rounded-md xs:w-40 sm:w-52 md:w-80 lg:w-96 ">
					{weatherData.forecast.map((item, index) => {
						return (
							<ForecastComponent
								weather={item}
								key={index}
								isBackgroundActive={isBackgroundActive}
							/>
						)
					})}
				</div>
			</div>
			{weatherStore.stateColor ? (
				<div
					className="absolute z-0 w-full h-24 opacity-50 -bottom-10 blur-2xl dark:opacity-30"
					style={{
						background: `linear-gradient(to bottom, ${iconColor} 0%, ${`${iconColor}00`} 0%, ${iconColor} 100%)`,
					}}
				></div>
			) : null}
		</div>
	)
}

function getMainColorFromImage(hexColor: string, theme: string) {
	// Generate color based on theme with color
	if (theme === 'light') {
		return hexColor
	}

	// Convert hex to RGB
	const color = hexColor.replace('#', '')
	const r = Number.parseInt(color.substring(0, 2), 16)
	const g = Number.parseInt(color.substring(2, 4), 16)
	const b = Number.parseInt(color.substring(4, 6), 16)

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
