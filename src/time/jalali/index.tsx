import type { BtimeSettingStore } from 'electron/store'
import moment from 'jalali-moment'
import ms from 'ms'
import React, { useEffect, useState } from 'react'
import { useGetEvents } from '../../api/hooks/events/getEvents.hook'
import { JalaliCalendar } from './jalaliCalendar'
import { getHijriEvents, getShamsiEvents } from './utils'

interface Prop {
	setting: BtimeSettingStore
}

export function JalaliComponent(prop: Prop) {
	const [today, setToday] = useState(
		moment().locale('fa').utc().add(3.5, 'hours'),
	)
	const [isTransparent, setIsTransparent] = useState<boolean>(false)
	const [isBackgroundActive, setBackgroundActive] = useState<boolean>(false)
	const { data: events } = useGetEvents()

	const { setting } = prop

	const checkIfHoliday = (day: moment.Moment, dayOfWeek) => {
		const todayShamsiEvent = getShamsiEvents(events, day)
		const todayHijriEvent = getHijriEvents(events, day)
		if (dayOfWeek === 5) return true
		const isHoliday =
			todayShamsiEvent?.some((event) => event.isHoliday) ||
			todayHijriEvent?.some((event) => event.isHoliday)

		return isHoliday
	}

	const dayOfWeek = (today.locale('fa').day() + 1) % 7
	const isHoliday = checkIfHoliday(today, dayOfWeek)

	useEffect(() => {
		setIsTransparent(
			document
				.querySelector('.h-screen')
				.classList.contains('transparent-active'),
		)
		const observer = new MutationObserver(() => {
			setIsTransparent(
				document
					.querySelector('.h-screen')
					.classList.contains('transparent-active'),
			)
		})

		const observerBackground = new MutationObserver(() => {
			setBackgroundActive(
				document.querySelector('.h-screen')?.classList?.contains('background'),
			)
		})

		observer.observe(document.querySelector('.h-screen'), {
			attributes: true,
			attributeFilter: ['class'],
		})
		observerBackground.observe(document.querySelector('.h-screen'), {
			attributes: true,
			attributeFilter: ['class'],
		})

		const interval = setInterval(() => {
			setToday(moment().locale('fa').utc().add(3.5, 'hours'))
		}, ms('5m')) // 5m

		return () => {
			observer.disconnect()
			observerBackground.disconnect()
			clearInterval(interval)
		}
	}, [])

	return (
		<div className="flex flex-row-reverse items-center justify-center w-full h-full">
			<div className="flex flex-col items-center lg:gap-4 gap-2 moveable w-[40%] relative">
				{isHoliday && <Holiday isBackgroundActive={isBackgroundActive} />}
				<div
					className={`select-none ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					{today.locale('fa').format('dddd')}
				</div>
				<div
					className={`text-6xl select-none ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					{today.locale('fa').jDate()}
				</div>
				<div
					className={`flex flex-row gap-1 ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					<div>{today.locale('fa').jYear()}</div>
					<div>{today.locale('fa').format('jMMMM')}</div>
				</div>
			</div>
			{setting.showCalendar && (
				<div className="justify-center hidden md:flex lg:flex not-moveable h-xs:hidden">
					<JalaliCalendar
						events={events}
						isBackgroundActive={isBackgroundActive}
						isHoliday={checkIfHoliday}
						currentTime={today}
						isTransparent={isTransparent}
					/>
				</div>
			)}
		</div>
	)
}
interface WeekDayComponentProp {
	isBackgroundActive: boolean
}
function Holiday({ isBackgroundActive }: WeekDayComponentProp) {
	return (
		<div
			className={`
		 absolute -top-5 right-10 text-center ${isBackgroundActive ? 'bg-red-500 text-gray-100' : 'bg-red-600/20 text-red-400'}
		 text-sm select-none transform 
		 lg:hidden
		 md:hidden
		 sm:hidden
		 xs:top-0 xs:-rotate-45 xs:right-10  xs:w-32
		 xxs:w-24 xxs:top-0 xxs:-rotate-45
		 `}
		>
			تعطیل
		</div>
	)
}

function getTextColor(isTransparent: boolean, isBackgroundActive: boolean) {
	let textColor = 'text-gray-600 dark:text-[#d3d3d3]'
	if (isTransparent || !isBackgroundActive) {
		textColor = 'text-[#ccc] text-gray-trasnparent'
	}
	return textColor
}
