import { EventCard } from './eventCard'

export const EventsDisplay = ({ events }) => (
  <div className="space-y-2">
    {events.length ? (
      <>
        <h2 className="px-2 text-sm font-semibold text-gray-800 dark:text-gray-200  text-gray-trasnparent">
          مناسبت های امروز
        </h2>
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </>
    ) : null}
  </div>
)
