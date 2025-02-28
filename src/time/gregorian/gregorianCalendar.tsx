import { Tooltip } from '@material-tailwind/react'
import type moment from 'jalali-moment'
import type { FetchedAllEvents } from 'src/api/api.interface'
import { getGregorianEvents } from '../jalali/utils'

interface GregorianCalendarProp {
	isTransparent: boolean
	isBackgroundActive: boolean
	currentTime: moment.Moment
	events: FetchedAllEvents
}

export function GregorianCalendar({
	isTransparent,
	currentTime,
	events,
	isBackgroundActive,
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
					<WeekDayComponent
						key={day}
						day={day}
						isTransparent={isTransparent}
						isBackgroundActive={isBackgroundActive}
					/>
				))}
				{[...Array(firstDayOfMonth)].map((_, index) => (
					<div key={index} className="p-1 text-center sm:p-2"></div>
				))}
				{Array.from({ length: daysInMonth }, (_, index) => (
					<DayComponent
						key={index}
						index={index}
						isTransparent={isTransparent}
						isBackgroundActive={isBackgroundActive}
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
	isTransparent: boolean
	isBackgroundActive: boolean
	events: FetchedAllEvents
	currentDate: moment.Moment
}

function DayComponent({
	index,
	gregorianFirstDay,
	isTransparent,
	events,
	currentDate,
	isBackgroundActive,
}: Prop) {
	const day = index + 1
	const cellDate = currentDate.clone().date(day)

	const dayEvents = getGregorianEvents(events, cellDate)

	const isCurrentDay = day === currentDate.date()

	const getTextColorClass = () => {
		if (isTransparent) {
			return 'dark:text-gray-200 text-gray-200 drop-shadow-md'
		}

		if (!isBackgroundActive) {
			return 'dark:text-gray-400 text-gray-300/90'
		}

		return 'dark:text-gray-300 text-gray-700'
	}

	const getBackgroundClass = () => {
		if (!isCurrentDay) {
			return ''
		}

		// Current day styling
		if (isTransparent) {
			return 'dark:bg-black/40 bg-black/20 dark:ring-1 ring-1 dark:ring-gray-400 ring-gray-300'
		}

		if (!isBackgroundActive) {
			return 'bg-black/20 dark:text-gray-200 backdrop-blur-sm hover:bg-neutral-800/80 dark:ring-1 ring-1 dark:ring-black/30 ring-gray-400'
		}

		return 'dark:bg-gray-800 bg-gray-100 dark:ring-1 ring-1 dark:ring-gray-600 ring-gray-400'
	}

	const getHoverClass = () => {
		if (isCurrentDay) return ''

		if (isTransparent) {
			return 'hover:bg-white/10 dark:hover:bg-black/20'
		}

		return 'hover:bg-gray-200 dark:hover:bg-gray-700'
	}

	const dayEventsList = dayEvents.length ? dayEvents : []

	const getTooltipClass = () => {
		if (isTransparent) {
			return 'backdrop-blur-md bg-black/40 dark:bg-black/60 text-gray-100'
		}
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
	isTransparent: boolean
	isBackgroundActive: boolean
}

function WeekDayComponent({
	day,
	isTransparent,
	isBackgroundActive,
}: WeekDayProp) {
	const getWeekdayClass = () => {
		if (isTransparent) {
			return 'dark:text-white text-gray-200 drop-shadow-sm'
		}

		if (!isBackgroundActive) {
			return 'dark:text-gray-400 text-gray-100'
		}

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
