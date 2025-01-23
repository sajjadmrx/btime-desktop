import { Tooltip } from '@material-tailwind/react'
import moment from 'jalali-moment'
import { useEffect, useState } from 'react'
import { type MonthEvent, getMonthEvents } from '../../api/api'
import { getJalaliFirstDayOfMonth } from './utils'

interface JalaliCalendarProp {
	isTransparent: boolean
	currentTime: moment.Moment
	isHoliday: (day: number, dayOfWeek: number) => boolean
	events: MonthEvent[]
}
export function JalaliCalendar({
	isTransparent,
	currentTime,
	isHoliday,
	events,
}: JalaliCalendarProp) {
	const daysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
	const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

	const jalaliDate = moment(currentTime)
		.locale('fa')
		.format('jYYYY-jM-jD')
		.split('-')

	const jalaliYear = Number.parseInt(jalaliDate[0])
	const jalaliMonth = Number.parseInt(jalaliDate[1]) - 1
	const jalaliDay = Number.parseInt(jalaliDate[2])

	const jalaliFirstDay = getJalaliFirstDayOfMonth(jalaliYear, jalaliMonth)

	return (
		<div
			className="w-full h-full px-1 pt-2 overflow-hidden rounded-lg max-w-96 not-moveable lg:pt-4"
			dir="rtl"
		>
			<div className="grid grid-cols-7 space-x-2 sm:p-2 lg:space-x-4">
				{weekDays.map((day, index) => (
					<WeekDayComponent
						key={day}
						day={day}
						isTransparent={isTransparent}
						index={index}
					/>
				))}
				{[...Array(jalaliFirstDay)].map((_, index) => (
					<div key={index} className="p-1 text-center sm:p-2"></div>
				))}
				{[...Array(daysInMonth[jalaliMonth])].map((_, index) => (
					<DayComponent
						key={index}
						index={index}
						isHoliday={isHoliday}
						isTransparent={isTransparent}
						jalaliDay={jalaliDay}
						jalaliFirstDay={jalaliFirstDay}
						events={events}
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
	jalaliDay: number
	isHoliday: (day: number, dayOfWeek: number) => boolean
	events: MonthEvent[]
}
function DayComponent({
	index,
	jalaliFirstDay,
	isTransparent,
	jalaliDay,
	isHoliday,
	events,
}: Prop) {
	const day = index + 1
	const dayOfWeek = (jalaliFirstDay + index) % 7
	const isHolidayDay = isHoliday(day, dayOfWeek)
	const isCurrentDay = day === jalaliDay
	let textColor = isTransparent
		? 'dark:text-gray-200 text-gray-300'
		: 'dark:text-gray-400 text-gray-600'
	if (isHolidayDay) {
		textColor = isTransparent
			? 'dark:bg-red-400/10 dark:text-red-400 text-gray-100/80 bg-gray-100/10'
			: 'bg-red-400/10 dark:text-red-400 text-red-600/70'
	}

	let isCurrentDayColor = null
	if (isHolidayDay) {
		isCurrentDayColor = isTransparent
			? 'dark:bg-black/60 bg-black/20 outline dark:outline-red-400/45  outline-gray-100/60'
			: 'outline outline-red-400/45'
	} else {
		isCurrentDayColor = isTransparent
			? 'dark:bg-black/60 bg-black/20 outline  outline-gray-100/60'
			: 'outline outline-gray-500'
	}

	isCurrentDayColor += ' -outline-offset-3 outline-1'

	// biome-ignore lint/suspicious/noDoubleEquals: <explanation>
	const dayEvents = events.filter((event) => Number(event.day) == day)

	const dayEventsList = dayEvents.length ? dayEvents.map((d) => d) : []

	const toolTipBgColor = isTransparent
		? 'bg-gray-800 dark:bg-gray-900'
		: 'bg-gray-100 dark:bg-gray-800'

	const hoverDayColor = isTransparent
		? 'hover:bg-gray-600/20 dark:hover:text-gray-200'
		: 'hover:bg-gray-600/20 dark:hover:text-gray-200'

	function DayEvents() {
		return dayEventsList.map((eventInfo, index) => (
			<li key={index} className="max-w-full truncate">
				<span
					className={`whitespace-break-spaces font-[Vazir] font-light text-xs ${eventInfo.isHoliday ? 'dark:text-red-400 text-red-600' : 'dark:text-gray-300 text-gray-600/80'}`}
				>
					{eventInfo.event} {eventInfo.isHoliday ? '(تعطیل)' : ''}
				</span>
			</li>
		))
	}

	return (
		<>
			<Tooltip
				className={`rounded-bl-3xl rounded-tr-3xl ${toolTipBgColor} w-52 min-h-2 truncate
          dark:bg-gray-900 bg-[#d2d2d2] dark:text-gray-200 text-gray-800 shadow-lg
          `}
				content={
					<div className="flex flex-col items-center justify-between w-full">
						<ul
							className="px-4 text-xs bg-gray-lightest text-blue-darkest dark:bg-d-black-30 dark:text-d-black-70"
							dir="rtl"
						>
							{dayEventsList.length ? (
								<DayEvents />
							) : (
								<li className="text-center dark:text-gray-300 text-gray-600 font-[Vazir] font-light text-xs">
									مناستبی ثبت نشده.
								</li>
							)}
						</ul>
						<div className="flex justify-between w-full px-4 py-1 text-xs text-gray dark:bg-d-black-40"></div>
					</div>
				}
				animate={{
					mount: { scale: 1, y: 0 },
					unmount: { scale: 0, y: 25 },
				}}
			>
				<div
					key={index}
					className={`text-center mb-[.1rem] h-5 p-1 rounded cursor-pointer text-xs sm:text-sm  
                transition-all duration-100  
                ${textColor}
                ${!isCurrentDay && hoverDayColor}
                ${isCurrentDay && isCurrentDayColor}
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
}
function WeekDayComponent({ day, isTransparent, index }: WeekDayProp) {
	let textColor = isTransparent
		? 'dark:text-white text-gray-300'
		: ' dark:text-gray-400 text-gray-600'

	if (index === 6) {
		textColor = isTransparent
			? ' dark:text-red-400 text-gray-100/40'
			: ' dark:text-red-400 text-red-600/70'
	}

	return (
		<div
			key={day}
			className={`text-center md:font-bold  text-xs xs:text-[10px] truncate mb-1 ${textColor}`}
		>
			{day}
		</div>
	)
}
