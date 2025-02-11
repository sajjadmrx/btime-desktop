import { useQuery } from '@tanstack/react-query'
import { getMainApi, getMainClient } from '../../api'
import type { FetchedWeather } from './weather.interface'

async function fetchWeatherByCity(
	city: string,
): Promise<FetchedWeather | null> {
	const client = await getMainClient()
	client.defaults.headers.userid = window.store.get('main').userId

	const response = await client.get(`/weather/current?city=${city}`)
	return response.data
}

export function useGetWeatherByCity(city: string) {
	return useQuery({
		queryKey: ['getWeatherByCity', city],
		queryFn: () => fetchWeatherByCity(city),
	})
}
