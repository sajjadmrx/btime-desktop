import { useQuery } from '@tanstack/react-query'
import { getMainApi, getMainClient } from '../../api'
import type { FetchedWeather } from './weather.interface'

async function fetchWeatherByLatLon(
	lat: number,
	lon: number,
): Promise<FetchedWeather | null> {
	const client = await getMainClient()
	client.defaults.headers.userid = window.store.get('main').userId

	const response = await client.get(`/weather/current?lat=${lat}&lon=${lon}`)
	return response.data
}

export function useGetWeatherByLatLon(
	lat: number,
	lon: number,
	options: { refetchInterval: number | null },
) {
	return useQuery({
		queryKey: ['getWeatherByLatLon', lat, lon],
		queryFn: () => fetchWeatherByLatLon(lat, lon),
		refetchInterval: options.refetchInterval || false,
	})
}
