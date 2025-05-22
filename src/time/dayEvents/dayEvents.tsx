import type moment from 'jalali-moment'
import { useEffect, useState } from 'react'
import type { FetchedEvent } from 'src/api/api.interface'
import { getAppLogo } from '../../api/api'
import { EventsDisplay } from './events/eventsDisplay'
import { NewsDisplay } from './news/newsDisplay'
export function DayEventsComponent() {
	const [events, setEvents] = useState<any[]>([])
	const [gif, setGif] = useState<string | null>(null)

	const [isTransparent, setIsTransparent] = useState<boolean>(false)

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
				className={`w-full ${isTransparent ? 'bg-gray-400/20 dark:bg-[#85858536]' : 'bg-gray-400 dark:bg-[#a8a8a833]'} h-0.5 mt-1 sm:invisible xs:invisible h-xs:invisible`}
			></div>
			<div className="flex flex-row-reverse justify-between p-2 lg:p-0 h-28 sm:invisible xs:invisible h-xs:invisible">
				<div
					className={`flex-col items-end w-72 h-24 overflow-y-auto scrollbar-thin 
						${isTransparent ? 'scrollbar-thumb-gray-300/20 scrollbar-track-gray-100/20 dark:scrollbar-thumb-gray-600/20 dark:scrollbar-track-gray-800/20' : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100/60 dark:scrollbar-thumb-gray-600/20 dark:scrollbar-track-gray-800/20'}
						`}
				>
					<div className="w-full px-4 py-2 text-right">
						{<EventsDisplay events={events} />}
					</div>
				</div>
				{gif && (
					<div className="flex items-center justify-center w-2/5 h-full pb-px">
						{<img className="h-16" src={gif} />}
					</div>
				)}
			</div>
		</div>
	)
}
