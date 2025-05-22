import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../../api'
export interface FetchedEvent {
	isHoliday: boolean
	title: string
	day: number
	month: number
}
export interface FetchedAllEvents {
	shamsiEvents: FetchedEvent[]
	gregorianEvents: FetchedEvent[]
	hijriEvents: FetchedEvent[]
}

export const useGetEvents = () => {
	return useQuery<FetchedAllEvents>({
		queryKey: ['get-events'],
		queryFn: async () => getEvents(),
		retry: 0,
		initialData: {
			shamsiEvents: [],
			gregorianEvents: [],
			hijriEvents: [],
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchOnWindowFocus: false,
	})
}

async function getEvents(): Promise<FetchedAllEvents> {
	const client = await getMainClient()
	const { data } = await client.get<FetchedAllEvents>('/date/events')
	return (
		data ?? {
			shamsiEvents: [],
			gregorianEvents: [],
			hijriEvents: [],
		}
	)
}
