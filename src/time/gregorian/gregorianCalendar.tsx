import { Tooltip } from '@material-tailwind/react'
import type moment from 'jalali-moment'
import type { FetchedAllEvents } from 'src/api/api.interface'
import { getGregorianEvents } from '../jalali/utils'

interface GregorianCalendarProp {
	currentTime: moment.Moment
	events: FetchedAllEvents
}

export function GregorianCalendar({
	currentTime,
	events,
}: GregorianCalendarProp) {
	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	const firstDayOfMonth = currentTime.clone().startOf('month').day()
	const daysInMonth = currentTime.clone().endOf('month').date()

	return (
		<div
			className={
				'w-full h-full px-1 pt-2 overflow-hidden rounded-lg max-w-96 not-moveable lg:pt-4 '
			}
		>
			<div className="grid grid-cols-7 gap-1 xs:gap-1.5 sm:gap-2">
				{weekDays.map((day, index) => (
					<WeekDayComponent key={day} day={day} />
				))}
				{[...Array(firstDayOfMonth)].map((_, index) => (
					<div key={index} className="p-1 text-center sm:p-2"></div>
				))}
				{Array.from({ length: daysInMonth }, (_, index) => (
					<DayComponent
						key={index}
						index={index}
						gregorianFirstDay={firstDayOfMonth}
						events={events}
						currentDate={currentTime}
					/>
				))}
			</div>
		</div>
	)
}

interface Prop {
	index: number
	gregorianFirstDay: number
	events: FetchedAllEvents
	currentDate: moment.Moment
}

function DayComponent({ index, gregorianFirstDay, events, currentDate }: Prop) {
	const day = index + 1
	const cellDate = currentDate.clone().date(day)

	const dayEvents = getGregorianEvents(events, cellDate)

	const isCurrentDay = day === currentDate.date()

	const getTextColorClass = () => {
		return 'dark:text-gray-300 text-gray-700'
	}

	const getBackgroundClass = () => {
		if (!isCurrentDay) {
			return ''
		}

		return 'dark:bg-gray-800 bg-gray-100 dark:ring-1 ring-1 dark:ring-gray-600 ring-gray-400'
	}

	const getHoverClass = () => {
		if (isCurrentDay) return ''

		return 'hover:bg-gray-200 dark:hover:bg-gray-700'
	}

	const dayEventsList = dayEvents.length ? dayEvents : []

	const getTooltipClass = () => {
		return 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg'
	}

	function DayEvents() {
		return dayEventsList.map((eventInfo, index) => (
			<li key={index} className="max-w-full truncate">
				<span
					className={`whitespace-break-spaces font-[Vazir] text-xs ${
						eventInfo.isHoliday
							? 'font-medium dark:text-red-400 text-red-600'
							: 'font-light dark:text-gray-300 text-gray-700'
					}`}
				>
					{eventInfo.title} {eventInfo.isHoliday ? '(Holiday)' : ''}
				</span>
			</li>
		))
	}

	return (
		<>
			<Tooltip
				className={`rounded-lg ${getTooltipClass()} w-52 min-h-2 truncate`}
				content={
					<div className="flex flex-col items-center justify-between w-full py-1">
						<ul className="w-full px-3 text-xs">
							{dayEventsList.length ? (
								<DayEvents />
							) : (
								<li className="text-center font-[Vazir] font-light text-xs dark:text-gray-300 text-gray-700">
									No events.
								</li>
							)}
						</ul>
					</div>
				}
				animate={{
					mount: { scale: 1, y: 0 },
					unmount: { scale: 0, y: 15 },
				}}
			>
				<div
					className={`text-center h-6 w-6 flex items-center justify-center
            rounded-full cursor-pointer text-xs sm:text-sm transition-all duration-200
            ${getTextColorClass()}
            ${getBackgroundClass()}
            ${getHoverClass()}
          `}
				>
					{day}
				</div>
			</Tooltip>
		</>
	)
}

interface WeekDayProp {
	day: string
}

function WeekDayComponent({ day }: WeekDayProp) {
	const getWeekdayClass = () => {
		return 'dark:text-gray-400 text-gray-700'
	}

	return (
		<div
			className={`text-center font-medium text-xs xs:text-[10px] truncate mb-1.5 ${getWeekdayClass()}`}
		>
			{day}
		</div>
	)
}
