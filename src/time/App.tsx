import { useEffect, useState } from 'react'
import moment from 'jalali-moment'
import { JalaliComponent } from './jalali'
import { BtimeSettingStore } from '../../electron/store'
import { widgetKey } from '../../shared/widgetKey'
import { GregorianComponent } from './gregorian'
import { DayEventsComponent } from './dayEvents/dayEvents'
import ms from 'ms'

function App() {
  const [widgetSetting, setWidgetSetting] = useState<BtimeSettingStore>(
    window.store.get(widgetKey.BTime)
  )
  const [currentDate, setCurrentDate] = useState(moment())

  useEffect(() => {
    const handleColorSchemeChange = (e) => {
      document.documentElement.classList.remove('dark')
      if (e.matches) {
        document.documentElement.classList.add('dark')
      }
    }

    const colorSchemeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    )
    handleColorSchemeChange(colorSchemeMediaQuery)

    window.ipcRenderer.on('updated-setting', function () {
      setWidgetSetting(window.store.get(widgetKey.BTime))
    })

    colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)

    const interval = setInterval(() => {
      setCurrentDate(moment())
    }, ms('5m')) // 5m

    return () => {
      colorSchemeMediaQuery.removeEventListener(
        'change',
        handleColorSchemeChange
      )
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <div className="h-screen w-screen overflow-hidden">
        <div className="flex flex-col h-screen overflow-hidden">
          {widgetSetting && widgetSetting.currentCalender == 'Gregorian' ? (
            <GregorianComponent currentTime={currentDate} setting={widgetSetting} />
          ) : (
            <JalaliComponent
              currentDate={currentDate}
              setting={widgetSetting}
            />
          )}
          {widgetSetting.showDayEvents && (
            <DayEventsComponent currentDate={currentDate} />
          )}
        </div>
      </div>
    </>
  )
}

export default App
