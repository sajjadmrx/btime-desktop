import { useEffect, useState } from 'react'

export function GregorianCalendar() {
  const [currentDate] = useState(new Date())
  const [isTransparent, setIsTransparent] = useState<boolean>(
    document.body.classList.contains('transparent-active')
  )

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Extract the Gregorian date components
  const gregorianYear = currentDate.getFullYear()
  const gregorianMonth = currentDate.getMonth() // 0-indexed
  const gregorianDay = currentDate.getDate()

  const daysInMonth = new Date(gregorianYear, gregorianMonth + 1, 0).getDate()

  const getGregorianFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay() // Returns day of week (0-indexed)
  }

  const gregorianFirstDay = getGregorianFirstDayOfMonth(
    gregorianYear,
    gregorianMonth
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsTransparent(document.body.classList.contains('transparent-active'))
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="w-full max-w-96 h-full rounded-lg overflow-clip not-moveable pt-2 lg:pt-4 px-1">
      <div className="grid grid-cols-7 space-x-2 sm:p-2 lg:space-x-4 font-[balooTamma] ">
        {weekDays.map((day, index) => (
          <WeekDayComponent
            day={day}
            isTransparent={isTransparent}
            key={index}
          />
        ))}
        {[...Array(gregorianFirstDay)].map((_, index) => (
          <div key={`empty-${index}`} className="text-center p-1 sm:p-2"></div>
        ))}
        {[...Array(daysInMonth)].map((_, index) => (
          <DayComponent
            gregorianDay={gregorianDay}
            index={index}
            isTransparent={isTransparent}
            key={index}
          />
        ))}
      </div>
    </div>
  )
}

interface Prop {
  index: number
  gregorianDay: number
  isTransparent: boolean
}
function DayComponent({ index, gregorianDay, isTransparent }: Prop) {
  const day = index + 1
  const isCurrentDay = day === gregorianDay

  const textColor = isTransparent
    ? 'dark:text-gray-200 text-gray-300'
    : 'dark:text-gray-400 text-gray-600'

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
}
function WeekDayComponent({ day, isTransparent }: WeekDayProp) {
  const textColor = isTransparent
    ? 'dark:text-white text-gray-300'
    : ' dark:text-gray-400 text-gray-600'

  return (
    <div
      key={day}
      className={`text-center md:font-bold  text-xs xs:text-[10px]  truncate mb-1 ${textColor}`}
    >
      {day}
    </div>
  )
}
