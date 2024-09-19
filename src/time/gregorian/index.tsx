import moment from 'jalali-moment'
import { GregorianCalendar } from './gregorianCalendar'
import { BtimeSettingStore } from 'electron/store'

interface Prop {
  currentTime: moment.Moment
  setting: BtimeSettingStore
}

export function GregorianComponent(prop: Prop) {
  const { currentTime, setting } = prop
  return (
    <div className="flex w-full items-center justify-center h-full flex-row-reverse">
      <div className="flex flex-col items-center justify-center gap-4 moveable  w-[40%]">
        <div className="select-none text-gray-600 text-gray-trasnparent dark:text-[#eee] font-[balooTamma]">
          {currentTime.locale('en').format('dddd')}
        </div>
        <div className="text-6xl select-none  text-gray-600 text-gray-trasnparent  dark:text-[#eee] font-[balooTamma]">
          {currentTime.locale('en').date()}
        </div>
        <div className="flex flex-row gap-3  text-gray-600 text-gray-trasnparent  dark:text-[#eee] font-[balooTamma]">
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
