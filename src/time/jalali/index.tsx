import type { BtimeSettingStore } from 'electron/store'
import type moment from 'jalali-moment'
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
				{isHoliday && (
					<>
						<div className="absolute w-32 px-2 py-1 text-sm text-[#f7374f] transform rotate-45 shadow-xl bg-red-600/60 -right-8 -top-4">
							<div className="relative z-10 font-extrabold tracking-wide text-center">
								تعطیل
							</div>
							<div className="absolute inset-0 opacity-50 bg-error/80 blur-xs" />
						</div>
						<div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-error/5 via-transparent to-error/10" />
						<div className="absolute w-2 h-2 rounded-full top-2 left-2 bg-error/30 animate-pulse" />
						<div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-error/20 rounded-full animate-pulse delay-300" />{' '}
					</>
				)}
				<div className={'select-none text-content'}>
					{today.locale('fa').format('dddd')}
				</div>
				<div className={'text-6xl font-extrabold select-none text-content'}>
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
				{isHoliday && (
					<>
						<div className="absolute w-32 px-2 py-1 text-sm text-[#f7374f] transform rotate-45 shadow-xl bg-red-600/60 left-12 top-2">
							<div className="relative z-10 font-extrabold tracking-wide text-center">
								تعطیل
							</div>
							<div className="absolute inset-0 opacity-50 bg-error/80 blur-xs" />
						</div>
						<div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-error/5 via-transparent to-error/10" />
						<div className="absolute w-2 h-2 rounded-full top-2 left-2 bg-error/30 animate-pulse" />
						<div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-error/20 rounded-full animate-pulse delay-300" />{' '}
					</>
				)}
				<div className={'select-none text-content'}>
					{today.locale('fa').format('dddd')}
				</div>
				<div className={'text-6xl select-none text-content'}>
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
