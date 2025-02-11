import type { RelatedCities } from './interface'

interface RelatedCityComponentProps {
	city: RelatedCities
	selectedCity: (city: RelatedCities) => void
}
export function RelatedCityComponent({
	city,
	selectedCity,
}: RelatedCityComponentProps) {
	return (
		<div
			key={city.name}
			className="flex flex-row items-center justify-between hover:bg-gray-200 dark:hover:bg-[#444] rounded-md p-2 h-10 w-full cursor-pointer"
			onClick={() => selectedCity(city)}
		>
			<div className="flex flex-col justify-between w-full gap-2 cursor-pointer">
				<label
					htmlFor="currency-select"
					className="text-gray-600 dark:text-[#eee] font-light truncate w-full cursor-pointer"
				>
					{city.name} {city.state && `(${city.state})`}
				</label>
			</div>
		</div>
	)
}
