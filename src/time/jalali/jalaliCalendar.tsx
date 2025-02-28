import { Tooltip } from '@material-tailwind/react'
import type moment from 'jalali-moment'
import type { FetchedAllEvents } from 'src/api/api.interface'

import { getGregorianEvents, getHijriEvents, getShamsiEvents } from './utils'

interface JalaliCalendarProp {
	isTransparent: boolean
	isBackgroundActive: boolean
	currentTime: moment.Moment
	isHoliday: (day: any, dayOfWeek: number) => boolean
	events: FetchedAllEvents
}
export function JalaliCalendar({
	isTransparent,
	currentTime,
	isHoliday,
	events,
	isBackgroundActive,
}: JalaliCalendarProp) {
	const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
	const firstDayOfMonth = currentTime.clone().startOf('jMonth').day()
	const daysInMonth = currentTime.clone().endOf('jMonth').jDate()
	const emptyDays = (firstDayOfMonth + 1) % 7

	return (
		<div
			className="w-full h-full px-1 pt-2 overflow-hidden rounded-lg max-w-96 not-moveable lg:pt-4"
			dir="rtl"
		>
			<div className="grid grid-cols-7 gap-1 space-x-2 sm:p-2 lg:space-x-4">
				{weekDays.map((day, index) => (
					<WeekDayComponent
						key={day}
						day={day}
						isTransparent={isTransparent}
						isBackgroundActive={isBackgroundActive}
						index={index}
					/>
				))}
				{[...Array(emptyDays)].map((_, index) => (
					<div key={index} className="p-1 text-center sm:p-2"></div>
				))}
				{Array.from({ length: daysInMonth }, (_, index) => (
					<DayComponent
						key={index}
						index={index}
						isHoliday={isHoliday}
						isTransparent={isTransparent}
						isBackgroundActive={isBackgroundActive}
						jalaliFirstDay={firstDayOfMonth}
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
	jalaliFirstDay: number
	isTransparent: boolean
	isBackgroundActive: boolean
	isHoliday: (day: any, dayOfWeek: number) => boolean
	events: FetchedAllEvents
	currentDate: moment.Moment
}
function DayComponent({
	index,
	jalaliFirstDay,
	isTransparent,
	isHoliday,
	events,
	currentDate,
	isBackgroundActive,
}: Prop) {
	const day = index + 1
	const cellDate = currentDate.clone().jDate(day)

	const dayOfWeek = (jalaliFirstDay + index) % 7
	const isHolidayDay = isHoliday(cellDate, dayOfWeek)
	const isCurrentDay = day === currentDate.jDate()

	const getTextColorClass = () => {
		if (isTransparent) {
			return isHolidayDay
				? 'dark:text-red-400 text-red-300 drop-shadow-md'
				: 'dark:text-gray-200 text-gray-200 drop-shadow-md'
		}

		if (!isBackgroundActive) {
			return isHolidayDay
				? 'dark:text-red-400 text-red-600'
				: 'dark:text-gray-400 text-gray-300'
		}

		if (isHolidayDay) {
			return 'dark:text-red-400 text-red-700'
		}

		return 'dark:text-gray-300 text-gray-700'
	}

	const getBackgroundClass = () => {
		if (!isCurrentDay) {
			if (isTransparent) {
				return isHolidayDay
					? 'dark:bg-red-800/10 bg-red-900/40 backdrop-blur-sm'
					: ''
			}

			if (!isBackgroundActive) {
				return isHolidayDay ? 'dark:bg-red-900/10 bg-red-400/10' : ''
			}

			return isHolidayDay ? 'dark:bg-red-900/10 bg-red-400/10' : ''
		}

		if (isTransparent) {
			return isHolidayDay
				? 'dark:bg-black/40 bg-black/20 dark:ring-1 ring-1 dark:ring-red-400 ring-red-300'
				: 'dark:bg-black/40 bg-black/20 dark:ring-1 ring-1 dark:ring-gray-400 ring-gray-300'
		}

		if (!isBackgroundActive) {
			return isHolidayDay
				? 'dark:bg-red-900/20  dark:ring-1 ring-1 dark:ring-red-500 ring-red-400'
				: 'bg-black/20 dark:text-gray-200 backdrop-blur-sm hover:bg-neutral-800/80 dark:ring-1 ring-1 dark:ring-black/30 ring-gray-400'
		}

		return isHolidayDay
			? 'dark:bg-red-900/20 bg-red-50 dark:ring-1 ring-1 dark:ring-red-500 ring-red-400'
			: 'dark:bg-gray-800 bg-gray-100 dark:ring-1 ring-1 dark:ring-gray-600 ring-gray-400'
	}

	const getHoverClass = () => {
		if (isCurrentDay) return ''

		if (isTransparent) {
			return 'hover:bg-white/10 dark:hover:bg-black/20'
		}

		return 'hover:bg-gray-200 dark:hover:bg-gray-700'
	}

	const dayEvents = [
		...getShamsiEvents(events, cellDate),
		...getHijriEvents(events, cellDate),
		...getGregorianEvents(events, cellDate),
	]
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
					{eventInfo.title} {eventInfo.isHoliday ? '(تعطیل)' : ''}
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
						<ul className="w-full px-3 text-xs" dir="rtl">
							{dayEventsList.length ? (
								<DayEvents />
							) : (
								<li className="text-center font-[Vazir] font-light text-xs dark:text-gray-300 text-gray-700">
									مناسبتی ثبت نشده.
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
						rounded-md cursor-pointer text-xs sm:text-sm transition-all duration-200
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
	index: number
	isBackgroundActive: boolean
}
function WeekDayComponent({
	day,
	isTransparent,
	index,
	isBackgroundActive,
}: WeekDayProp) {
	const isFriday = index === 6

	const getWeekdayClass = () => {
		if (isTransparent) {
			return isFriday
				? 'dark:text-red-400 text-red-300 drop-shadow-sm'
				: 'dark:text-white text-gray-200 drop-shadow-sm'
		}

		if (!isBackgroundActive) {
			return isFriday
				? 'dark:text-red-400 text-red-600'
				: 'dark:text-gray-400 text-gray-100'
		}

		return isFriday
			? 'dark:text-red-400 text-red-600'
			: 'dark:text-gray-400 text-gray-700'
	}

	return (
		<div
			className={`text-center font-medium text-xs xs:text-[10px] truncate mb-1.5 ${getWeekdayClass()}`}
		>
			{day}
		</div>
	)
}
