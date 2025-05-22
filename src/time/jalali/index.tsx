import type { BtimeSettingStore } from 'electron/store'
import moment from 'jalali-moment'
import ms from 'ms'
import { useEffect, useState } from 'react'
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

	const isHoliday = checkIfHoliday(today, today.day())

	return setting.showCalendar ? (
		<div className="flex flex-row-reverse items-start w-full h-full py-1">
			<div className="flex flex-col items-center self-center lg:gap-4 gap-2 moveable w-[40%] relative">
				<div
					className={`select-none ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					{today.locale('fa').format('dddd')}
				</div>
				<div
					className={`text-6xl select-none ${getTextColor(isTransparent, isBackgroundActive)} ${isHoliday ? '!text-red-600' : ''}`}
				>
					{today.locale('fa').jDate()}
				</div>
				<div
					className={`flex flex-col gap-2 ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
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
			{
				<div className="justify-center hidden ml-2 md:flex lg:flex not-moveable h-xs:hidden">
					<JalaliCalendar
						events={events}
						isBackgroundActive={isBackgroundActive}
						isHoliday={checkIfHoliday}
						currentTime={today}
						isTransparent={isTransparent}
					/>
				</div>
			}
		</div>
	) : (
		<div className="flex justify-center w-full h-full py-1">
			<div className="flex flex-col items-center justify-center lg:gap-4 gap-2 moveable w-[40%] relative">
				<div
					className={`select-none ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					{today.locale('fa').format('dddd')}
				</div>
				<div
					className={`text-6xl select-none ${getTextColor(isTransparent, isBackgroundActive)} ${isHoliday ? '!text-red-600' : ''}`}
				>
					{today.locale('fa').jDate()}
				</div>
				<div
					className={`flex flex-col gap-2 ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
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

function getTextColor(isTransparent: boolean, isBackgroundActive: boolean) {
	let textColor = 'text-gray-600 dark:text-[#d3d3d3]'
	if (isTransparent || !isBackgroundActive) {
		textColor = 'text-[#ccc] text-gray-trasnparent'
	}
	return textColor
}
