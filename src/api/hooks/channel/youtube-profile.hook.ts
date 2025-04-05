import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../../api'

export interface ChannelInfo {
	name: string
	subscribers: number
	isValid: boolean
	profile?: string
	description?: string
}

export const useGetYoutubeProfile = (
	channelName: string,
	enabled: boolean,
	refreshIntervalMs: number,
) => {
	return useQuery<ChannelInfo>({
		queryKey: ['validate-channel', channelName],
		queryFn: async () => {
			if (!channelName || channelName.trim() === '') {
				return {
					name: '',
					subscribers: 0,
					isValid: false,
				}
			}

			return getYoutubeProfile(channelName)
		},
		enabled,
		retry: 1,
		staleTime: 1000 * 60 * 15, // 15 minutes
		refetchInterval: refreshIntervalMs ? refreshIntervalMs : undefined,
	})
}

async function getYoutubeProfile(channelName: string): Promise<ChannelInfo> {
	try {
		const client = await getMainClient()
		const { data } = await client.get<ChannelInfo>(
			`/google/youtube/profile/${channelName}`,
		)

		return {
			...data,
			isValid: true,
		}
	} catch (error) {
		// If the API returns an error, the channel is not valid
		return {
			name: channelName,
			subscribers: 0,
			isValid: false,
		}
	}
}
