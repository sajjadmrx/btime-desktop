export const EventCard = ({ event }) => {
	return (
		<div
			className={`px-2 flex items-center space-x-3 ${event.isHoliday ? 'border-r-2 text-red-400 border-red-500 rounded' : ''}`}
		>
			{event.isHoliday && (
				<div className="flex-shrink-0 flex justify-center">
					<p className="text-xs text-red-400">(تعطیل)</p>
				</div>
			)}

			<div className="flex-grow">
				<p
					className={
						'text-sm font-light text-gray-trasnparent text-gray-700 dark:text-gray-300 '
					}
				>
					{event.title}
				</p>
			</div>
		</div>
	)
}
