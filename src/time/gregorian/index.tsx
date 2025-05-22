import type { BtimeSettingStore } from 'electron/store'
import moment from 'jalali-moment'
import ms from 'ms'
import { useEffect, useState } from 'react'
import { useGetEvents } from '../../api/hooks/events/getEvents.hook'
import { GregorianCalendar } from './gregorianCalendar'

interface Prop {
	setting: BtimeSettingStore
}

export function GregorianComponent(prop: Prop) {
	const [today, setToday] = useState(
		moment().locale('en').utc().add(3.5, 'hours'),
	)
	const { setting } = prop
	const { data: events } = useGetEvents()

	const dayOfWeek = today.locale('en').day()

	useEffect(() => {
		const interval = setInterval(() => {
			setToday(moment().locale('en').utc().add(3.5, 'hours'))
		}, ms('5m')) // Update every 5 minutes

		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<div className="flex flex-row-reverse items-center justify-center w-full h-full">
			<div className="flex flex-col items-center lg:gap-4 gap-2 moveable w-[40%] relative">
				<div
					className={
						'select-none font-[balooTamma] text-gray-700 dark:text-gray-200'
					}
				>
					{today.locale('en').format('dddd')}
				</div>
				<div
					className={
						'text-6xl select-none font-[balooTamma] text-gray-700 dark:text-gray-200'
					}
				>
					{today.locale('en').date()}
				</div>
				<div
					className={
						'flex flex-row gap-3 font-[balooTamma] text-gray-700 dark:text-gray-200'
					}
				>
					<div>{today.locale('en').year()}</div>
					<div>{today.locale('en').format('MMMM')}</div>
				</div>
			</div>
			{setting.showCalendar && (
				<div className="justify-center hidden md:flex lg:flex not-moveable h-xs:hidden">
					<GregorianCalendar currentTime={today} events={events} />
				</div>
			)}
		</div>
	)
}
