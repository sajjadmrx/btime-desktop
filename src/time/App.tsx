import { useEffect, useState } from 'react'
import moment from 'jalali-moment'
import { JalaliComponent } from './jalali'
import { BtimeSettingStore } from '../../electron/store'
import { widgetKey } from '../../shared/widgetKey'
import { GregorianComponent } from './gregorian'

function App() {
  const [widgetSetting, setWidgetSetting] = useState<BtimeSettingStore>(
    window.store.get(widgetKey.BTime)
  )
  useEffect(() => {
    console.log(widgetSetting)
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
    return () => {
      colorSchemeMediaQuery.removeEventListener(
        'change',
        handleColorSchemeChange
      )
    }
  }, [])

  return (
    <>
      <div className="h-screen w-screen overflow-hidden">
        {widgetSetting && widgetSetting.currentCalender == 'Gregorian' ? (
          <GregorianComponent currentTime={moment()} />
        ) : (
          <JalaliComponent currentDate={moment()} />
        )}
      </div>
    </>
  )
}

export default App
