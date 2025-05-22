interface ForecastComponentProps {
	weather: {
		temp: number
		icon: string
		date: string
	}
	isDarkMode: boolean
	iconColor: string | null
}

export function ForecastComponent({
	weather,
	isDarkMode,
	iconColor,
}: ForecastComponentProps) {
	const time = weather.date.split(' ')[1]
	const h = time.split(':')[0]
	const m = time.split(':')[1]

	const getTextClass = () => {
		return isDarkMode ? 'text-gray-100' : 'text-gray-700'
	}

	return (
		<div
			className={`flex flex-col items-center justify-around w-full 
      h-auto gap-0.5 xs:gap-1 p-1 backdrop-blur-sm bg-neutral-900/70 rounded-lg`}
		>
			<p
				className={`text-[0.55rem] xs:text-[0.65rem] sm:text-xs font-medium ${getTextClass()}`}
				style={{
					color: iconColor ? getAdjustedColor(iconColor, isDarkMode) : '',
				}}
			>
				{h}:{m}
			</p>
			<img
				src={weather.icon}
				className="object-contain w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 drop-shadow-md"
				alt="Weather icon"
			/>
			<p
				className={`text-[0.65rem] xs:text-[0.75rem] sm:text-sm font-medium ${getTextClass()}`}
				style={{
					color: iconColor ? getAdjustedColor(iconColor, isDarkMode) : '',
				}}
			>
				{weather.temp.toFixed(0)}
				<sup className="font-[balooTamma] text-[0.4rem] xs:text-[0.45rem] sm:text-[0.5rem]">
					°
				</sup>
			</p>
		</div>
	)
}

function getAdjustedColor(hexColor: string, isDarkMode: boolean) {
	// Simple color adjustment based on mode
	if (!hexColor) return ''

	return hexColor
}
