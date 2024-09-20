import type moment from 'jalali-moment'
import { JalaliCalendar } from './jalaliCalendar'
import React from 'react'
import type { BtimeSettingStore } from 'electron/store'

interface Prop {
	currentDate: moment.Moment
	setting: BtimeSettingStore
}

export function JalaliComponent(prop: Prop) {
	const { currentDate: currentTime, setting } = prop

	return (
		<div className="flex w-full items-center justify-center h-full flex-row-reverse">
			<div className="flex flex-col items-center lg:gap-4 gap-2 moveable w-[40%]">
				<div className="select-none text-gray-600 text-gray-trasnparent dark:text-[#eee]">
					{currentTime.locale('fa').format('dddd')}
				</div>
				<div className="text-6xl select-none text-gray-600 text-gray-trasnparent dark:text-[#eee]  ">
					{currentTime.locale('fa').jDate()}
				</div>
				<div className="flex flex-row gap-1 text-gray-600 text-gray-trasnparent dark:text-[#eee]">
					<div>{currentTime.locale('fa').jYear()}</div>
					<div>{currentTime.locale('fa').format('jMMMM')}</div>
				</div>
			</div>
			{setting.showCalendar && (
				<div className="hidden md:flex lg:flex justify-center  not-moveable h-xs:hidden">
					<JalaliCalendar currentDate={currentTime} />
				</div>
			)}
		</div>
	)
}
