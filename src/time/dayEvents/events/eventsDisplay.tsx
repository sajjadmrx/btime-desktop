import { EventCard } from './eventCard'

export const EventsDisplay = ({ events }) => (
	<div className="space-y-2">
		{events.length ? (
			<>
				{events.map((event, index) => (
					<EventCard key={index} event={event} />
				))}
			</>
		) : null}
	</div>
)
