// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Button, Checkbox, Switch, Typography } from '@material-tailwind/react'
import { widgetKey, windowSettings } from '../../electron/store'
import { useEffect, useState } from 'react'

function App() {
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

    colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)
    return () => {
      colorSchemeMediaQuery.removeEventListener(
        'change',
        handleColorSchemeChange
      )
    }
  }, [])
  interface Setting {
    btime: {
      enable: boolean
      transparent: boolean
      alwaysOnTop: boolean
    }
    rate: {
      enable: boolean
      transparent: boolean
      alwaysOnTop: boolean
    }
    theme: 'system' | 'light' | 'dark'
  }

  const [setting, setSetting] = useState<Setting>(null)
  useEffect(() => {
    const NerkhYab: windowSettings = window.store.get(
      'NerkhYab' as widgetKey.NerkhYab
    )
    const BTime: windowSettings = window.store.get('BTime')
    const theme = window.store.get('theme')
    setSetting({
      btime: {
        enable: BTime.enable,
        transparent: BTime.transparentStatus,
        alwaysOnTop: BTime.alwaysOnTop,
      },
      rate: {
        enable: NerkhYab.enable,
        transparent: NerkhYab.transparentStatus,
        alwaysOnTop: NerkhYab.alwaysOnTop,
      },
      theme,
    })
  }, [])

  function setSettingValue<T extends keyof Setting>(key: T, value: Setting[T]) {
    setSetting((prev) => ({ ...prev, [key]: value }))
  }

  function onApplyChanges() {
    const NerkhYabStore: windowSettings & { currencies: string[] } =
      window.store.get('NerkhYab')
    const BTimeStore: windowSettings = window.store.get('BTime')

    if (!setting.btime.enable) {
      return alert('ویجت تاریخ رو نمیشه غیر فعال کرد')
    }

    window.store.set('BTime', {
      enable: setting.btime.enable,
      transparentStatus: setting.btime.transparent,
      alwaysOnTop: setting.btime.alwaysOnTop,
      bounds: BTimeStore.bounds,
    })

    window.store.set('NerkhYab', {
      enable: setting.rate.enable,
      transparentStatus: setting.rate.transparent,
      alwaysOnTop: setting.rate.alwaysOnTop,
      bounds: NerkhYabStore.bounds,
      currencies: NerkhYabStore.currencies,
    })

    window.store.set('theme', setting.theme)
    window.ipcMain.reOpen()
  }

  return (
    <>
      <div className="h-screen w-screen  moveable overflow-hidden">
        <div className="py-3 px-0 h-full ">
          <div className="flex flex-col h-full justify-around items-center ">
            <div className="flex flex-col items-center justify-between  w-full flex-wrap gap-5">
              <div
                className="w-full px-5 text-right text-gray-600  dark:text-[#eee]"
                dir="rtl"
              >
                ویجت تاریخ
                <div className="flex flex-col mt-2 justify-around gap-3 not-moveable">
                  <div className="flex flex-row items-center justify-between w-full gap-2">
                    <Switch
                      id={'time-startUp'}
                      color={'blue'}
                      onClick={() =>
                        setSettingValue('btime', {
                          ...setting.btime,
                          enable: !setting.btime.enable,
                        })
                      }
                      defaultChecked={setting?.btime.enable}
                      label={
                        <div>
                          <Typography
                            variant={'h5'}
                            color="blue-gray"
                            className="text-gray-600  dark:text-[#c7c7c7] text-[13px] font-[Vazir] flex flex-row items-center mr-3"
                          >
                            فعال سازی
                          </Typography>
                          <Typography
                            variant="h5"
                            color="gray"
                            className="dark:text-gray-500 text-[12px] font-[Vazir] mr-3"
                          >
                            فعالسازی ویجت نمایش تاریخ
                          </Typography>
                        </div>
                      }
                      containerProps={{
                        className: '-mt-5 mr-2',
                      }}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between w-full gap-2">
                    <Checkbox
                      onClick={() => {
                        setSettingValue('btime', {
                          ...setting.btime,
                          transparent: !setting.btime.transparent,
                        })
                      }}
                      ripple={true}
                      defaultChecked={setting?.btime.transparent}
                      label={
                        <div>
                          <Typography
                            variant={'h5'}
                            color="blue-gray"
                            className="dark:text-[#c7c7c7] text-gray-600  text-[13px] font-[Vazir] flex flex-row items-center "
                          >
                            شفاف
                          </Typography>
                          <Typography
                            variant="h5"
                            color="gray"
                            className="dark:text-gray-500 text-gray-600 text-[12px] font-[Vazir]"
                          >
                            استفاده از پس زمینه شفاف
                          </Typography>
                        </div>
                      }
                      containerProps={{
                        className: '-mt-5 mr-2',
                      }}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between w-full gap-2">
                    <Checkbox
                      onClick={() => {
                        setSettingValue('btime', {
                          ...setting.btime,
                          alwaysOnTop: !setting.btime.alwaysOnTop,
                        })
                      }}
                      ripple={true}
                      defaultChecked={setting?.btime.alwaysOnTop}
                      label={
                        <div>
                          <Typography
                            variant={'h5'}
                            color="blue-gray"
                            className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir] flex flex-row items-center "
                          >
                            اولویت بالا
                          </Typography>
                          <Typography
                            variant="h5"
                            color="gray"
                            className="dark:text-gray-500 text-gray-600 text-[12px] font-[Vazir]"
                          >
                            اولویت بالایی برای نمایش
                          </Typography>
                        </div>
                      }
                      containerProps={{
                        className: '-mt-5 mr-2',
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                className="w-full px-5 text-right dark:text-gray-200 text-gray-600"
                dir="rtl"
              >
                ویجت نرخ ارز
                <div className="flex flex-col mt-4 justify-around gap-3 not-moveable">
                  <div className="flex flex-row items-center justify-between w-full gap-2">
                    <Switch
                      id={'nerkh-startUp'}
                      color={'blue'}
                      onClick={() =>
                        setSettingValue('rate', {
                          ...setting.rate,
                          enable: !setting.rate.enable,
                        })
                      }
                      defaultChecked={setting?.rate.enable}
                      label={
                        <div>
                          <Typography
                            variant={'h5'}
                            color="blue-gray"
                            className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir] flex flex-row items-center mr-3"
                          >
                            فعال سازی
                          </Typography>
                          <Typography
                            variant="h5"
                            color="gray"
                            className="dark:text-gray-500 text-gray-600 text-[12px] font-[Vazir] mr-3"
                          >
                            فعالسازی ویجت نمایش نرخ ارز
                          </Typography>
                        </div>
                      }
                      containerProps={{
                        className: '-mt-5 mr-2',
                      }}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between w-full gap-2">
                    <Checkbox
                      ripple={true}
                      onClick={() =>
                        setSettingValue('rate', {
                          ...setting.rate,
                          transparent: !setting.rate.transparent,
                        })
                      }
                      defaultChecked={setting?.rate.transparent}
                      label={
                        <div>
                          <Typography
                            variant={'h5'}
                            color="blue-gray"
                            className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir] flex flex-row items-center "
                          >
                            شفاف
                          </Typography>
                          <Typography
                            variant="h5"
                            color="gray"
                            className="dark:text-gray-500 text-gray-600 text-[12px] font-[Vazir]"
                          >
                            استفاده از پس زمینه شفاف
                          </Typography>
                        </div>
                      }
                      containerProps={{
                        className: '-mt-5 mr-2',
                      }}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between w-full">
                    <Checkbox
                      ripple={true}
                      onClick={() =>
                        setSettingValue('rate', {
                          ...setting.rate,
                          alwaysOnTop: !setting.rate.alwaysOnTop,
                        })
                      }
                      defaultChecked={setting?.rate.alwaysOnTop}
                      label={
                        <div>
                          <Typography
                            variant={'h5'}
                            color="blue-gray"
                            className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir] flex flex-row items-center "
                          >
                            اولویت بالا
                          </Typography>
                          <Typography
                            variant="h5"
                            color="gray"
                            className="dark:text-gray-500 text-gray-600 text-[12px] font-[Vazir]"
                          >
                            اولویت بالایی برای نمایش
                          </Typography>
                        </div>
                      }
                      containerProps={{
                        className: '-mt-5 mr-2',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-5 text-right not-moveable " dir="rtl">
              <div className="flex flex-col dark:text-gray-400 text-gray-600">
                تم
                <div className="w-full flex flex-row justify-around px-3 gap-4 transition ">
                  <div
                    className={`w-20 flex flex-row transition active:outline-none  ${setting?.theme === 'light' ? 'border border-[#3f3fc9dd]' : 'hover:bg-[#3f3fc975] bg-opacity-10 hover:text-gray-200'} p-2 rounded-lg items-center justify-center`}
                    onClick={() => setSettingValue('theme', 'light')}
                  >
                    <p className="text-[13px] font-[Vazir]">روشن</p>
                  </div>
                  <div
                    className={`w-20 flex flex-row transition active:outline-none ${setting?.theme === 'dark' ? 'border border-[#3f3fc9dd]' : 'hover:bg-[#3f3fc975] bg-opacity-10 hover:text-gray-200'} p-2 rounded-lg items-center justify-center`}
                    onClick={() => setSettingValue('theme', 'dark')}
                  >
                    <p className="text-[13px] font-[Vazir]">تاریک</p>
                  </div>
                  <div
                    className={`w-20 flex flex-row transition active:outline-none ${setting?.theme === 'system' ? 'border border-[#3f3fc9dd]' : 'hover:bg-[#3f3fc975] bg-opacity-10 hover:text-gray-200'} p-2 rounded-lg items-center justify-center`}
                    onClick={() => setSettingValue('theme', 'system')}
                  >
                    خودکار
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row-reverse gap-3 w-full px-5">
              <Button
                color="green"
                ripple={true}
                className="w-6/12 font-[Vazir] not-moveable hover:bg-green-700"
                onClick={() => onApplyChanges()}
              >
                اعمال تغییرات
              </Button>
              <Button
                color="red"
                ripple={true}
                className="w-6/12 font-[Vazir] not-moveable hover:bg-red-700"
                onClick={() => window.close()}
              >
                بستن تنظیمات
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
