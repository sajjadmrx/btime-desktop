import { useQuery } from '@tanstack/react-query'
import { getMainApi, getMainClient } from '../../api'

async function fetchRelatedCities(city: string): Promise<any[]> {
	const client = await getMainClient()
	client.defaults.headers.userid = window.store.get('main').userId

	const response = await client.get(`/weather/direct?q=${city}`)
	return response.data
}

export function useGetRelatedCities(city: string, enabled: boolean) {
	return useQuery({
		queryKey: ['getRelatedCities', city],
		queryFn: () => fetchRelatedCities(city),
		enabled: enabled,
	})
}
