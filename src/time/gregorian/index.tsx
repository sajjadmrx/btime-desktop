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
	const [isTransparent, setIsTransparent] = useState<boolean>(false)
	const [isBackgroundActive, setBackgroundActive] = useState<boolean>(false)
	const { data: events } = useGetEvents()

	const dayOfWeek = today.locale('en').day()

	useEffect(() => {
		const isContainClass = (className: string) => {
			const element = document.querySelector('.h-screen')
			if (!element) return false
			return element.classList.contains(className)
		}

		setIsTransparent(isContainClass('transparent-active'))
		setBackgroundActive(isContainClass('background'))

		const observer = new MutationObserver(() => {
			setIsTransparent(isContainClass('transparent-active'))
		})

		const observerBackground = new MutationObserver(() => {
			setBackgroundActive(isContainClass('background'))
		})

		if (document.querySelector('.h-screen')) {
			observer.observe(document.querySelector('.h-screen'), {
				attributes: true,
				attributeFilter: ['class'],
			})

			observerBackground.observe(document.querySelector('.h-screen'), {
				attributes: true,
				attributeFilter: ['class'],
			})
		}

		const interval = setInterval(() => {
			setToday(moment().locale('en').utc().add(3.5, 'hours'))
		}, ms('5m')) // Update every 5 minutes

		return () => {
			observer.disconnect()
			observerBackground.disconnect()
			clearInterval(interval)
		}
	}, [])

	return (
		<div className="flex flex-row-reverse items-center justify-center w-full h-full">
			<div className="flex flex-col items-center lg:gap-4 gap-2 moveable w-[40%] relative">
				<div
					className={`select-none font-[balooTamma] ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					{today.locale('en').format('dddd')}
				</div>
				<div
					className={`text-6xl select-none font-[balooTamma] ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					{today.locale('en').date()}
				</div>
				<div
					className={`flex flex-row gap-3 font-[balooTamma] ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					<div>{today.locale('en').year()}</div>
					<div>{today.locale('en').format('MMMM')}</div>
				</div>
			</div>
			{setting.showCalendar && (
				<div className="justify-center hidden md:flex lg:flex not-moveable h-xs:hidden">
					<GregorianCalendar
						currentTime={today}
						isTransparent={isTransparent}
						isBackgroundActive={isBackgroundActive}
						events={events}
					/>
				</div>
			)}
		</div>
	)
}

function getTextColor(isTransparent: boolean, isBackgroundActive: boolean) {
	if (isTransparent) {
		return 'text-gray-200 drop-shadow-md'
	}

	if (!isBackgroundActive) {
		return 'text-gray-400 dark:text-gray-300'
	}

	return 'text-gray-700 dark:text-gray-200'
}
