import moment from 'jalali-moment'
import { GregorianCalendar } from './gregorianCalendar'

interface Prop {
  currentTime: moment.Moment
}

export function GregorianSlider(prop: Prop) {
  const { currentTime } = prop
  return (
    <div className="flex h-screen items-center justify-center flex-row-reverse overflow-hidden">
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
      <div className="hidden md:flex lg:flex  flex-col items-center justify-center not-moveable">
        <GregorianCalendar />
      </div>
    </div>
  )
}
