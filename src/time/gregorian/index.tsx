import type moment from 'jalali-moment'
import { GregorianCalendar } from './gregorianCalendar'
import type { BtimeSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'

interface Prop {
	currentTime: moment.Moment
	setting: BtimeSettingStore
}

export function GregorianComponent(prop: Prop) {
	const { currentTime, setting } = prop
	const [isTransparent, setIsTransparent] = useState<boolean>(false)
	const [isBackgroundActive, setBackgroundActive] = useState<boolean>(false)

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

	return (
		<div className="flex w-full items-center justify-center h-full flex-row-reverse">
			<div className="flex flex-col items-center justify-center gap-4 moveable  w-[40%]">
				<div
					className={`select-none font-[balooTamma] ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					{currentTime.locale('en').format('dddd')}
				</div>
				<div
					className={`text-6xl select-none  font-[balooTamma]  ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					{currentTime.locale('en').date()}
				</div>
				<div
					className={`flex flex-row gap-3  font-[balooTamma]  ${getTextColor(isTransparent, isBackgroundActive)}`}
				>
					<div>{currentTime.locale('en').year()}</div>
					<div>{currentTime.locale('en').format('MMMM')}</div>
				</div>
			</div>
			{setting.showCalendar && (
				<div className="hidden md:flex lg:flex justify-center  not-moveable h-xs:hidden">
					<GregorianCalendar />
				</div>
			)}
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
