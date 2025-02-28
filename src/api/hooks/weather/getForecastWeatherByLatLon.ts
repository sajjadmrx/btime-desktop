import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../../api'
import type { FetchedForecast, TemperatureUnit } from './weather.interface'

async function fetchForecastWeatherByLatLon(
	lat: number,
	lon: number,
	count: number,
	units: TemperatureUnit,
): Promise<FetchedForecast[]> {
	const client = await getMainClient()

	const response = await client.get<FetchedForecast[]>('/weather/forecast', {
		params: {
			lat,
			lon,
			...(count !== null && { count }),
			...(units !== null && { units }),
		},
	})
	return response.data
}

export function useGetForecastWeatherByLatLon(
	lat: number,
	lon: number,

	options: {
		refetchInterval: number | null
		count: number
		units: TemperatureUnit
	},
) {
	return useQuery({
		queryKey: ['ForecastGetWeatherByLatLon', lat, lon],
		queryFn: () =>
			fetchForecastWeatherByLatLon(lat, lon, options.count, options.units),
		refetchInterval: options.refetchInterval || false,
	})
}
