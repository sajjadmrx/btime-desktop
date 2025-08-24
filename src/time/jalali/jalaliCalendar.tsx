import type moment from 'jalali-moment'
import type { FetchedAllEvents } from 'src/api/api.interface'

interface JalaliCalendarProp {
	currentTime: moment.Moment
	isHoliday: (day: any, dayOfWeek: number) => boolean
	events: FetchedAllEvents
}
export function JalaliCalendar({
	currentTime,
	isHoliday,
	events,
}: JalaliCalendarProp) {
	const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
	const firstDayOfMonth = currentTime.clone().startOf('jMonth').day()
	const daysInMonth = currentTime.clone().endOf('jMonth').jDate()
	const emptyDays = (firstDayOfMonth + 1) % 7
	const prevMonth = currentTime.clone().subtract(1, 'jMonth')
	const daysInPrevMonth = prevMonth.clone().endOf('jMonth').jDate()
	const prevMonthStartDay = daysInPrevMonth - emptyDays + 1

	const totalCells = 42

	const nextMonthDays = totalCells - daysInMonth - emptyDays

	return (
		<div
			className="w-full h-full p-1 px-1 overflow-hidden rounded-lg max-w-96 lg:pt-4"
			dir="rtl"
		>
			<div className="grid grid-cols-7 gap-1 space-x-1">
				{weekDays.map((day, index) => (
					<WeekDayComponent key={day} day={day} index={index} />
				))}
				{Array.from({ length: emptyDays }).map((_, i) => (
					<div
						key={`prev-month-${i}`}
						className={`
						p-0 text-xs
						h-6 w-6 mx-auto flex items-center justify-center rounded-full
						text-muted font-thin
					`}
					>
						{prevMonthStartDay + i}
					</div>
				))}

				{Array.from({ length: daysInMonth }, (_, index) => (
					<DayComponent
						key={index}
						index={index}
						isHoliday={isHoliday}
						jalaliFirstDay={firstDayOfMonth}
						currentDate={currentTime}
					/>
				))}

				{Array.from({ length: nextMonthDays }).map((_, i) => (
					<div
						key={`next-month-${i}`}
						className={`
						p-0 text-xs
						h-6 w-6 mx-auto flex items-center justify-center rounded-full
						text-muted font-thin
					`}
					>
						{i + 1}
					</div>
				))}
			</div>
		</div>
	)
}

interface Prop {
	index: number
	jalaliFirstDay: number

	isHoliday: (day: any, dayOfWeek: number) => boolean
	currentDate: moment.Moment
}
function DayComponent({ index, jalaliFirstDay, isHoliday, currentDate }: Prop) {
	const day = index + 1
	const cellDate = currentDate.clone().jDate(day)

	const dayOfWeek = (jalaliFirstDay + index) % 7
	const isHolidayDay = isHoliday(cellDate, dayOfWeek)
	const isCurrentDay = day === currentDate.jDate()

	const getTextColorClass = () => {
		if (isHolidayDay) {
			return 'dark:text-red-400 text-red-700'
		}

		return 'text-content'
	}

	const getBackgroundClass = () => {
		if (!isCurrentDay) {
			return isHolidayDay ? 'dark:bg-red-900/10 bg-red-400/10' : ''
		}

		return isHolidayDay
			? 'dark:bg-red-900/20 bg-red-400/10 ring-1 dark:ring-red-500/50 ring-red-400'
			: 'dark:bg-gray-800/20 bg-gray-100/30 ring-1 dark:ring-gray-800/40 ring-gray-300/60'
	}

	return (
		<div
			className={`text-center h-6 w-6 flex items-center justify-center
						rounded-md  text-xs sm:text-sm transition-all duration-200
						${getTextColorClass()}
						${getBackgroundClass()}
					`}
		>
			{day}
		</div>
	)
}

interface WeekDayProp {
	day: string
	index: number
}
function WeekDayComponent({ day, index }: WeekDayProp) {
	const isFriday = index === 6

	const getWeekdayClass = () => {
		return isFriday
			? 'dark:text-red-400 text-red-600'
			: 'text-content opacity-80'
	}

	return (
		<div
			className={`text-center font-medium text-xs xs:text-[10px] truncate ${getWeekdayClass()}`}
		>
			{day}
		</div>
	)
}
