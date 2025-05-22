import { Tooltip } from '@material-tailwind/react'
import type moment from 'jalali-moment'
import { BsCalendarEvent, BsInfoCircle } from 'react-icons/bs'
import { FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa'
import { IoCalendarOutline } from 'react-icons/io5'
import type { FetchedAllEvents } from 'src/api/api.interface'

import {
	convertShamsiToHijri,
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
} from './utils'

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
	const prevMonth = currentTime.clone().subtract(1, 'jMonth')
	const daysInPrevMonth = prevMonth.clone().endOf('jMonth').jDate()
	const prevMonthStartDay = daysInPrevMonth - emptyDays + 1

	const totalCells = 42

	const nextMonthDays = totalCells - daysInMonth - emptyDays

	return (
		<div
			className="w-full h-full p-1 px-1 overflow-hidden rounded-lg max-w-96 not-moveable lg:pt-4"
			dir="rtl"
		>
			<div className="grid grid-cols-7 gap-1 space-x-1">
				{weekDays.map((day, index) => (
					<WeekDayComponent
						key={day}
						day={day}
						isTransparent={isTransparent}
						isBackgroundActive={isBackgroundActive}
						index={index}
					/>
				))}
				{Array.from({ length: emptyDays }).map((_, i) => (
					<div
						key={`prev-month-${i}`}
						className={`
						p-0 text-xs
						h-6 w-6 mx-auto flex items-center justify-center rounded-full
						dark:text-gray-300 text-gray-700 opacity-40
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
						isTransparent={isTransparent}
						isBackgroundActive={isBackgroundActive}
						jalaliFirstDay={firstDayOfMonth}
						events={events}
						currentDate={currentTime}
					/>
				))}

				{Array.from({ length: nextMonthDays }).map((_, i) => (
					<div
						key={`next-month-${i}`}
						className={`
						p-0 text-xs 
						h-6 w-6 mx-auto flex items-center justify-center rounded-full
					dark:text-gray-300 text-gray-700 opacity-40
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
				? 'dark:text-red-400 text-red-900 drop-shadow-md'
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
				return isHolidayDay ? 'dark:bg-red-800/10 bg-red-400/40 ' : ''
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

	const dayEvents = [...getShamsiEvents(events, cellDate)]
	const dayEventsList = dayEvents.length ? dayEvents : []

	const getTooltipClass = () => {
		return 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-xl border-gray-200/30 dark:border-gray-700/70'
	}

	function DayEvents() {
		return dayEventsList.map((eventInfo, index) => (
			<li
				key={index}
				className="flex font-[Vazir] items-center max-w-full space-x-1 space-x-reverse truncate"
			>
				<div
					className={`h-2 w-2 rounded-full flex-shrink-0 ${eventInfo.isHoliday ? 'bg-red-500' : 'bg-blue-400'}`}
				></div>
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
				className={`rounded-lg ${getTooltipClass()} w-64 min-h-2 p-0 overflow-hidden border shadow-lg`}
				content={
					<div className="flex flex-col w-full" dir="rtl">
						{/* Date Information Header */}
						<div className="w-full p-1 border-b bg-black/10 dark:bg-white/5 border-gray-200/10 dark:border-gray-700/50 font-[Vazir]">
							<div
								className="flex flex-row items-center justify-between"
								dir="rtl"
							>
								<div className="flex items-center gap-2">
									<IoCalendarOutline className="w-4 h-4 text-blue-400" />
									<span className="text-xs font-semibold">
										{cellDate.format('jDD jMMMM jYYYY')}
									</span>
								</div>
								<div
									className={`text-sm font-bold rounded-full h-7 w-7 flex items-center justify-center
									${
										isHolidayDay
											? 'bg-red-500/20 text-red-500 ring-1 ring-red-500/30'
											: 'bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20'
									}`}
								>
									{day}
								</div>
							</div>
						</div>

						{/* Events List */}
						<div className="px-3 py-2">
							<h3 className="text-xs font-medium mb-2 flex items-center font-[Vazir] gap-1.5">
								<BsCalendarEvent className="w-3.5 h-3.5" />
								مناسبت‌های روز
							</h3>
							<ul
								className="w-full space-y-1.5 max-h-48 overflow-y-auto"
								dir="rtl"
							>
								{dayEventsList.length ? (
									<DayEvents />
								) : (
									<li className="text-center font-[Vazir] font-light text-xs dark:text-gray-300 text-gray-700 py-1 flex items-center justify-center gap-1">
										<BsInfoCircle className="w-3 h-3 text-gray-400" />
										مناسبتی ثبت نشده.
									</li>
								)}
							</ul>
						</div>
					</div>
				}
				animate={{
					mount: { scale: 1, y: 0 },
					unmount: { scale: 0, y: 15 },
				}}
				placement="bottom"
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
				? 'dark:text-red-400 text-red-400'
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
			className={`text-center font-medium text-xs xs:text-[10px] truncate  ${getWeekdayClass()}`}
		>
			{day}
		</div>
	)
}
