import { useEffect, useState } from 'react'
import { useGetEvents } from '../../api/hooks/events/getEvents.hook'
import { useGetGoogleCalendarEvents } from '../../api/hooks/events/getGoogleCalendarEvents.hook'
import { useAuth } from '../../context/auth.context'
import { useDate } from '../context/date.context'
import {
	combineAndSortEvents,
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
} from '../jalali/utils'
import { EventCard } from './events/eventCard'

interface DayEventsComponentProps {
	refreshTrigger?: number
}

export function DayEventsComponent({
	refreshTrigger = 0,
}: DayEventsComponentProps) {
	const { today } = useDate()
	const { isAuthenticated } = useAuth()
	const { data: googleEvents, refetch: refetchGoogleEvents } =
		useGetGoogleCalendarEvents(isAuthenticated, today.toDate())

	const { data: events, refetch: refetchEvents } = useGetEvents()
	const dayEvents = combineAndSortEvents(events, today, googleEvents)

	const [isTransparent, setIsTransparent] = useState<boolean>(false)

	// Handle refresh trigger
	useEffect(() => {
		if (refreshTrigger > 0) {
			refetchEvents()
			if (isAuthenticated) {
				refetchGoogleEvents()
			}
		}
	}, [refreshTrigger, isAuthenticated, refetchEvents, refetchGoogleEvents])

	useEffect(() => {
		setIsTransparent(
			document
				.querySelector('.h-screen')
				?.classList?.contains('transparent-active'),
		)

		const observer = new MutationObserver(() => {
			setIsTransparent(
				document
					.querySelector('.h-screen')
					?.classList?.contains('transparent-active'),
			)
		})

		observer.observe(document.querySelector('.h-screen'), {
			attributes: true,
			attributeFilter: ['class'],
		})

		return () => {
			observer.disconnect()
		}
	}, [])

	return (
		<div>
			<div
				className={`w-full ${
					isTransparent
						? 'bg-gray-400/20 dark:bg-[#85858536]'
						: 'bg-gray-400 dark:bg-[#a8a8a833]'
				} h-0.5 mt-1 sm:invisible xs:invisible h-xs:invisible`}
			></div>
			<div className="flex flex-row-reverse justify-between h-full">
				<div
					className={`flex-col items-end w-72 h-24 overflow-y-auto scrollbar-thin 
						${
							isTransparent
								? 'scrollbar-thumb-gray-300/20 scrollbar-track-gray-100/20 dark:scrollbar-thumb-gray-600/20 dark:scrollbar-track-gray-800/20'
								: 'scrollbar-thumb-gray-300 scrollbar-track-gray-100/60 dark:scrollbar-thumb-gray-600/20 dark:scrollbar-track-gray-800/20'
						}
						`}
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
				{/* {gif && (
					<div className="flex items-center justify-center w-2/5 h-full pb-px">
						{<img className="h-16" src={gif} />}
					</div>
				)} */}
			</div>
		</div>
	)
}
