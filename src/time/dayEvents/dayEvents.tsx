import { useEffect, useState } from 'react'
import { useGetEvents } from '../../api/hooks/events/getEvents.hook'
import { useGetGoogleCalendarEvents } from '../../api/hooks/events/getGoogleCalendarEvents.hook'
import { useAuth } from '../../context/auth.context'
import { useDate } from '../context/date.context'
import { combineAndSortEvents } from '../jalali/utils'
import { EventCard } from './events/eventCard'

interface DayEventsComponentProps {
	refreshTrigger?: number
	onLoadingStateChange?: (isLoading: boolean) => void
}

export function DayEventsComponent({
	refreshTrigger = 0,
	onLoadingStateChange,
}: DayEventsComponentProps) {
	const { today } = useDate()
	const { isAuthenticated } = useAuth()
	const { data: googleEvents, refetch: refetchGoogleEvents } =
		useGetGoogleCalendarEvents(isAuthenticated, today.toDate())

	const { data: events, refetch: refetchEvents } = useGetEvents()
	const dayEvents = combineAndSortEvents(events, today, googleEvents)

	const [isLoading, setIsLoading] = useState(false)

	const fetchData = async () => {
		setIsLoading(true)
		try {
			const promises: Promise<any>[] = [refetchEvents()]
			if (isAuthenticated) {
				promises.push(refetchGoogleEvents())
			}
			await Promise.all(promises)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (onLoadingStateChange) {
			onLoadingStateChange(isLoading)
		}
	}, [isLoading, onLoadingStateChange])

	useEffect(() => {
		fetchData()
	}, [isAuthenticated])

	useEffect(() => {
		if (refreshTrigger > 0) {
			fetchData()
		}
	}, [refreshTrigger])

	return (
		<div>
			<div
				className={
					'w-full bg-gray-400 dark:bg-[#a8a8a833] h-0.5 mt-1 sm:invisible xs:invisible h-xs:invisible'
				}
			></div>
			<div className="flex flex-row-reverse justify-between h-full">
				<div
					className={
						'flex-col items-end w-72 h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100/60 dark:scrollbar-thumb-gray-600/20 dark:scrollbar-track-gray-800/20'
					}
				>
					{' '}
					<div className="flex flex-col w-full gap-0.5 p-1 pb-4 text-right">
						{dayEvents.length > 0 ? (
							dayEvents.map((event, index) => (
								<EventCard key={index} event={event} />
							))
						) : (
							<div className="flex items-center justify-center py-3 text-sm text-gray-500 dark:text-gray-400">
								رویدادی وجود ندارد
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
