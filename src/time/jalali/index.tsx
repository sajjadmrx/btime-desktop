import type { BtimeSettingStore } from 'electron/store'
import type moment from 'jalali-moment'
import ms from 'ms'
import { useEffect, useState } from 'react'
import { useGetEvents } from '../../api/hooks/events/getEvents.hook'
import { useDate } from '../context/date.context'
import { JalaliCalendar } from './jalaliCalendar'
import { getHijriEvents, getShamsiEvents } from './utils'

interface Prop {
	setting: BtimeSettingStore
}

export function JalaliComponent(prop: Prop) {
	const { today } = useDate()
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

	const isHoliday = checkIfHoliday(today, today.day())

	return setting.showCalendar ? (
		<div className="flex flex-row-reverse items-start w-full h-full py-1 moveable">
			<div className="flex flex-col items-center self-center lg:gap-4 gap-2 w-[40%] relative">
				<div className={'select-none text-content'}>
					{today.locale('fa').format('dddd')}
				</div>
				<div
					className={`text-6xl font-extrabold select-none text-content ${isHoliday ? '!text-red-600' : ''}`}
				>
					{today.locale('fa').jDate()}
				</div>
				<div className={'flex flex-col gap-0 text-content'}>
					<div className="flex flex-row items-center gap-2">
						<div className="font-medium">{today.locale('fa').jYear()}</div>
						<div className="font-medium">
							{today.locale('fa').format('jMMMM')}
						</div>
					</div>
					<div className="text-xs font-medium text-center opacity-95">
						{today.doAsGregorian().format('YYYY/MM/DD')}
					</div>
				</div>
			</div>
			<div className="justify-center hidden ml-2 md:flex lg:flex h-xs:hidden">
				<JalaliCalendar
					events={events}
					isHoliday={checkIfHoliday}
					currentTime={today}
				/>
			</div>
		</div>
	) : (
		<div className="flex justify-center w-full h-full py-1 moveable">
			<div className="flex flex-col items-center justify-center lg:gap-4 gap-2 w-[40%] relative">
				<div className={'select-none text-content'}>
					{today.locale('fa').format('dddd')}
				</div>
				<div
					className={`text-6xl select-none text-content ${isHoliday ? '!text-red-600' : ''}`}
				>
					{today.locale('fa').jDate()}
				</div>
				<div className={'flex flex-col gap-2 text-content'}>
					<div className="flex flex-row items-center gap-2">
						<div className="font-medium">{today.locale('fa').jYear()}</div>
						<div className="font-medium">
							{today.locale('fa').format('jMMMM')}
						</div>
					</div>
					<div className="text-xs font-medium text-center opacity-95">
						{today.doAsGregorian().format('YYYY/DD/MM')}
					</div>
				</div>
			</div>
		</div>
	)
}
