interface ForecastComponentProps {
	weather: {
		temp: number
		icon: string
		date: string
	}
	isBackgroundActive: boolean
	isTransparent: boolean
	isDarkMode: boolean
	iconColor: string | null
}

export function ForecastComponent({
	weather,
	isBackgroundActive,
	isTransparent,
	isDarkMode,
	iconColor,
}: ForecastComponentProps) {
	const time = weather.date.split(' ')[1]
	const h = time.split(':')[0]
	const m = time.split(':')[1]

	const getTextClass = () => {
		if (isTransparent) {
			return isDarkMode
				? 'text-gray-100 drop-shadow-md'
				: 'text-gray-100 drop-shadow-lg'
		}
		console.log('isBackgroundActive', isBackgroundActive)
		if (!isBackgroundActive) {
			return isDarkMode ? 'text-gray-200' : 'text-gray-400'
		}
		return isDarkMode ? 'text-gray-100' : 'text-gray-700'
	}

	return (
		<div
			className={`flex flex-col items-center justify-around w-full 
      h-auto gap-0.5 xs:gap-1 p-1 
      ${isTransparent ? ' backdrop-blur-sm bg-neutral-900/70 rounded-lg' : ''}`}
		>
			<p
				className={`text-[0.55rem] xs:text-[0.65rem] sm:text-xs font-medium ${getTextClass()}`}
				style={{
					color: iconColor
						? getAdjustedColor(iconColor, isDarkMode, isTransparent)
						: '',
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
					color: iconColor
						? getAdjustedColor(iconColor, isDarkMode, isTransparent)
						: '',
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

function getAdjustedColor(
	hexColor: string,
	isDarkMode: boolean,
	isTransparent: boolean,
) {
	// Simple color adjustment based on mode
	if (!hexColor) return ''

	// For transparent mode, make colors more vibrant
	if (isTransparent) {
		// Make it brighter for better visibility
		const color = hexColor.replace('#', '')
		const r = Number.parseInt(color.substring(0, 2), 16)
		const g = Number.parseInt(color.substring(2, 4), 16)
		const b = Number.parseInt(color.substring(4, 6), 16)

		const factor = isDarkMode ? 1.3 : 1.5
		const brighten = (value: number) =>
			Math.min(255, Math.floor(value * factor))

		const brightR = brighten(r)
		const brightG = brighten(g)
		const brightB = brighten(b)

		const toHex = (value: number) => value.toString(16).padStart(2, '0')
		return `#${toHex(brightR)}${toHex(brightG)}${toHex(brightB)}`
	}

	return hexColor
}
