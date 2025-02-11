interface ForecastComponentProps {
	weather: {
		temp: number
		icon: string
		date: string
	}
	isBackgroundActive: boolean
}
export function ForecastComponent({
	weather,
	isBackgroundActive,
}: ForecastComponentProps) {
	const time = weather.date.split(' ')[1]
	const h = time.split(':')[0]
	const m = time.split(':')[1]

	let textColor = 'text-gray-600 text-gray-trasnparent dark:text-[#d3d3d3]'
	if (!isBackgroundActive) {
		textColor = 'text-gray-300'
	}

	return (
		<div className="flex flex-col items-center justify-around w-full h-10 gap-1 p-1 sm:h-12 sm:w-16 md:h-20 md:px-4 md:w-full lg:h-16 lg:w-60">
			<p
				className={`xs:text-[.60rem] sm:text-[.70rem] md:text-[.90rem] lg:text-[.90rem] xs:w-10 sm:w-14 ${textColor}`}
			>
				{h}:{m}
			</p>
			<img
				src={weather.icon}
				className="xs:w-4 xs:h-4 sm:w-6 sm:h-6 md:w-8 md:h-w-8 lg:w-10 lg:h-10"
			/>
			<p className={`text-[.80rem] w-10 ${textColor}`}>
				{weather.temp.toFixed(0)}
				<sup className="font-[balooTamma] text-[.50rem]">°</sup>
			</p>
		</div>
	)
}
