import { JalaliCalendar } from './jalaliCalendar'
import React, { useEffect, useState } from 'react'
import type { BtimeSettingStore } from 'electron/store'
import { getMonthEvents, type MonthEvent } from '../../api/api'
import type moment from 'jalali-moment'

interface Prop {
	currentDate: moment.Moment
	setting: BtimeSettingStore
}

export function JalaliComponent(prop: Prop) {
	const [isTransparent, setIsTransparent] = useState<boolean>(false)
	const [isBackgroundActive, setBackgroundActive] = useState<boolean>(false)

	const { currentDate: currentTime, setting } = prop
	const [events, setEvents] = useState<MonthEvent[]>([])

	const checkIfHoliday = (day, dayOfWeek) => {
		// biome-ignore lint/suspicious/noDoubleEquals: <explanation>
		const eventDay = events.filter((event) => event.day == day) || []
		const isHoliday = eventDay.find((event) => event.isHoliday)
		if (eventDay && isHoliday) {
			return true
		}
		return dayOfWeek === 6 // 6 represents Friday (0-indexed)
	}

	const day = currentTime.locale('fa').format('dddd')
	const dayOfWeek = (currentTime.locale('fa').day() + 1) % 7
	const isHoliday = checkIfHoliday(day, dayOfWeek)

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

		return () => {
			observer.disconnect()
			observerBackground.disconnect()
		}
	}, [])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getMonthEvents().then((data) => {
			setEvents(data)
		})

		return () => {
			setEvents([])
		}
	}, [currentTime])

	return (
		<div className="flex w-full items-center justify-center h-full flex-row-reverse">
			<div className="flex flex-col items-center lg:gap-4 gap-2 moveable w-[40%] relative">
				{isHoliday && <Holiday />}
				<div
					className={`select-none ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					{currentTime.locale('fa').format('dddd')}
				</div>
				<div
					className={`text-6xl select-none ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					{currentTime.locale('fa').jDate()}
				</div>
				<div
					className={`flex flex-row gap-1 ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					<div>{currentTime.locale('fa').jYear()}</div>
					<div>{currentTime.locale('fa').format('jMMMM')}</div>
				</div>
			</div>
			{setting.showCalendar && (
				<div className="hidden md:flex lg:flex justify-center  not-moveable h-xs:hidden">
					<JalaliCalendar
						events={events}
						isHoliday={checkIfHoliday}
						currentTime={currentTime}
						isTransparent={isTransparent}
					/>
				</div>
			)}
		</div>
	)
}

function Holiday() {
	return (
		<div
			className="
		 
		 absolute -top-5 right-10 bg-red-500 text-gray-100 text-center
		 text-sm select-none transform 
		 lg:hidden
		 md:hidden
		 sm:hidden
		 xs:top-0 xs:-rotate-45 xs:right-10  xs:w-32
		 xxs:w-24 xxs:top-0 xxs:-rotate-45
		 font-extralight

		  "
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
