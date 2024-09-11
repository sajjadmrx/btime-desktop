import moment from 'jalali-moment'
import { useEffect, useState } from 'react'
import { getMonthEvents, MonthEvent } from '../../../api/api'

// const holidayColor = 'dark:text-red-200/60 text-red-200/60'

interface JalaliCalendarProp {
  currentDate: moment.Moment
}
export function JalaliCalendar({ currentDate }: JalaliCalendarProp) {
  const [isTransparent, setIsTransparent] = useState<boolean>(
    document.body.classList.contains('transparent-active')
  )

  const [events, setEvents] = useState<MonthEvent[]>([])

  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

  const jalaliDate = moment(currentDate)
    .locale('fa')
    .format('jYYYY-jM-jD')
    .split('-')

  const jalaliYear = parseInt(jalaliDate[0])
  const jalaliMonth = parseInt(jalaliDate[1]) - 1 // Months in your code are 0-indexed
  const jalaliDay = parseInt(jalaliDate[2])

  const daysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]

  const isHoliday = (day, dayOfWeek) => {
    const eventDay = events.find((event) => event.day == day)
    if (eventDay && eventDay.isHoliday) {
      return true
    }

    return dayOfWeek === 6 // 6 represents Friday (0-indexed)
  }

  const getJalaliFirstDayOfMonth = (year, month) => {
    const firstDayOfMonth = moment(
      `${year}-${month + 1}-01`,
      'jYYYY-jM-D'
    ).day()
    return (firstDayOfMonth + 1) % 7 // Adjust to start the week from Saturday
  }

  const jalaliFirstDay = getJalaliFirstDayOfMonth(jalaliYear, jalaliMonth)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsTransparent(document.body.classList.contains('transparent-active'))
    })

    getMonthEvents().then((data) => {
      console.log(data)
      setEvents(data)
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      observer.disconnect()
    }
  }, [currentDate])

  return (
    <div
      className="w-full max-w-96 h-full rounded-lg overflow-clip not-moveable pt-2 lg:pt-4  px-1"
      dir="rtl"
    >
      <div className="grid grid-cols-7 space-x-2 sm:p-2 lg:space-x-4">
        {weekDays.map((day, index) => (
          <WeekDayComponent
            day={day}
            isTransparent={isTransparent}
            index={index}
            key={day}
          />
        ))}
        {[...Array(jalaliFirstDay)].map((_, index) => (
          <div key={`empty-${index}`} className="text-center p-1 sm:p-2"></div>
        ))}
        {[...Array(daysInMonth[jalaliMonth])].map((_, index) => {
          return (
            <DayComponent
              index={index}
              isHoliday={isHoliday}
              isTransparent={isTransparent}
              jalaliDay={jalaliDay}
              jalaliFirstDay={jalaliFirstDay}
              key={index}
            />
          )
        })}
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
}
function DayComponent({
  index,
  jalaliFirstDay,
  isTransparent,
  jalaliDay,
  isHoliday,
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
      ? 'dark:text-red-400 text-gray-100/50'
      : 'dark:text-red-400 text-red-600/70'
  }

  let isCurrentDayColor = isTransparent
    ? 'dark:bg-black/60 bg-black/20 outline'
    : ' outline '

  isCurrentDayColor += 'outline-gray-700/70 -outline-offset-3 outline-1'

  return (
    <div
      key={index}
      className={`text-center mb-[.1rem] h-5 p-1 rounded cursor-pointer text-xs sm:text-sm  lg:text-xl lg:h-8
                transition-all duration-100  
                ${textColor}
                ${isCurrentDay && isCurrentDayColor}
              `}
    >
      {day}
    </div>
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
