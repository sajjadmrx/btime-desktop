import ms from 'ms'
import { useEffect, useState } from 'react'
import type { WeatherSettingStore } from '../../../electron/store'
import { useGetForecastWeatherByLatLon } from '../../api/hooks/weather/getForecastWeatherByLatLon'
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
	const { data: forecast } = useGetForecastWeatherByLatLon(
		weatherStore.city.lat,
		weatherStore.city.lon,
		{
			refetchInterval: ms('5m'),
			count: 3,
			units: 'metric',
		},
	)

	const [iconColor, setIconColor] = useState('')

	// Improved text color handling for all modes
	const getTextColorClass = () => {
		if (isTransparent) {
			return isDarkMode
				? 'text-gray-100 drop-shadow-md'
				: 'text-gray-100 drop-shadow-lg'
		}
		if (!isBackgroundActive) {
			return isDarkMode ? 'text-gray-200' : 'text-gray-400'
		}
		return isDarkMode ? 'text-gray-100' : 'text-gray-700'
	}

	useEffect(() => {
		if (weatherData && weatherStore.stateColor) {
			extractMainColorFromImage(weatherData.weather.icon.url).then((color) => {
				setIconColor(color)
			})
		}
	}, [weatherData, weatherStore.stateColor])

	return (
		<div
			className={`relative flex flex-col items-center justify-around w-full
        px-2 xs:px-3 sm:px-4 py-3 xs:py-4 
        rounded-lg transition-all duration-300`}
		>
			<div className="z-10 flex flex-row items-center justify-between w-full gap-2 xs:gap-3 sm:gap-4">
				<div className="flex items-center justify-center h-10 xs:h-12 sm:h-14 overflow-clip">
					<img
						src={weatherData.weather.icon.url}
						width={weatherData.weather.icon.width}
						height={weatherData.weather.icon.height}
						alt={`${weatherData.weather.label} ایکون`}
						className="object-contain w-10 h-10 xs:w-8 sm:w-10 xs:h-8 sm:h-10 drop-shadow-md"
					/>
				</div>
				<div className="relative w-16 mt-1 text-xl text-center truncate xs:w-18 sm:w-20 xs:text-2xl sm:text-3xl">
					<div
						className={`z-10 font-semibold ${getTextColorClass()}`}
						style={{
							color:
								weatherStore.stateColor && iconColor
									? getMainColorFromImage(
											iconColor,
											isDarkMode ? 'dark' : 'light',
											isTransparent,
										)
									: '',
						}}
					>
						<span className="text-2xl xs:text-3xl sm:text-4xl">
							{Math.floor(weatherData.weather.temperature.temp)}
						</span>
						<sup className="font-[balooTamma] text-base xs:text-lg sm:text-xl">
							°
						</sup>
					</div>
				</div>
			</div>
			<div className="z-10 flex flex-col w-full mt-2 font-bold text-center">
				<div
					className={`w-auto truncate font-normal text-center text-[0.65rem] xs:text-xs sm:text-sm mb-2 ${getTextColorClass()}`}
				>
					{weatherData.weather.temperature.temp_description}
				</div>
				<div className="flex flex-row justify-around w-full gap-1 py-1 mt-1 font-light rounded-md xs:py-2 xs:mt-2">
					{forecast?.map((item, index) => {
						return (
							<ForecastComponent
								weather={item}
								key={index}
								isBackgroundActive={isBackgroundActive}
								isTransparent={isTransparent}
								isDarkMode={isDarkMode}
								iconColor={weatherStore.stateColor ? iconColor : null}
							/>
						)
					})}
				</div>
			</div>
			{weatherStore.stateColor && iconColor ? (
				<div
					className={`absolute z-0 w-full h-20 xs:h-24 ${isTransparent ? 'opacity-30' : isDarkMode ? 'opacity-40' : 'opacity-20'} -bottom-10 blur-2xl`}
					style={{
						background: `linear-gradient(to bottom, ${iconColor} 0%, ${`${iconColor}00`} 10%, ${iconColor} 100%)`,
					}}
				></div>
			) : null}
		</div>
	)
}

function getMainColorFromImage(
	hexColor: string,
	theme: string,
	isTransparent: boolean,
) {
	// If transparent, make color more vibrant
	if (isTransparent) {
		// Convert hex to RGB
		const color = hexColor.replace('#', '')
		const r = Number.parseInt(color.substring(0, 2), 16)
		const g = Number.parseInt(color.substring(2, 4), 16)
		const b = Number.parseInt(color.substring(4, 6), 16)

		// Brighten for transparent mode
		const factor = theme === 'dark' ? 3.7 : 3.0
		const brighten = (value: number) =>
			Math.max(0, Math.min(255, Math.floor(value * factor + 50)))

		const brightR = brighten(r)
		const brightG = brighten(g)
		const brightB = brighten(b)

		// Convert RGB back to hex
		const toHex = (value: number) => value.toString(16).padStart(2, '0')
		return `#${toHex(brightR)}${toHex(brightG)}${toHex(brightB)}`
	}

	// Standard theme-based color
	if (theme === 'light') {
		return hexColor
	}

	// Convert hex to RGB
	const color = hexColor.replace('#', '')
	const r = Number.parseInt(color.substring(0, 2), 16)
	const g = Number.parseInt(color.substring(2, 4), 16)
	const b = Number.parseInt(color.substring(4, 6), 16)

	// Adjust for dark theme
	const factor = 3.7
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
