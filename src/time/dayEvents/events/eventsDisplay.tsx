import { useId } from 'react'
import { EventCard } from './eventCard'

export const EventsDisplay = ({ events }) => (
	<div className="space-y-2">
		{events.length ? (
			<>
				{events.map((event) => (
					<EventCard key={useId()} event={event} />
				))}
			</>
		) : null}
	</div>
)
