import { Checkbox, Slider, Switch, Typography } from '@material-tailwind/react'
import { BtimeSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../../../shared/widgetKey'

export function BtimeSetting() {
  const [setting, setSetting] = useState<BtimeSettingStore>(null)
  useEffect(() => {
    const btime: BtimeSettingStore = window.store.get(widgetKey.BTime)
    btime.borderRaduis = btime.borderRaduis || 28
    setSetting(btime)
  }, [])

  function setSettingValue<T extends keyof BtimeSettingStore>(
    key: T,
    value: BtimeSettingStore[T]
  ) {
    setting[key] = value
    setSetting({ ...setting })
    applyChanges()
    if (key == 'transparentStatus') {
      window.ipcRenderer.send('toggle-transparent', widgetKey.BTime)
    }
  }

  function applyChanges() {
    window.store.set('BTime' as widgetKey.BTime, {
      alwaysOnTop: setting.alwaysOnTop,
      enable: setting.enable,
      transparentStatus: setting.transparentStatus,
      bounds: window.store.get('BTime' as widgetKey.BTime).bounds,
      borderRaduis: setting.borderRaduis,
    })
  }

  async function onSliderChange(value: number) {
    const fixedValue = Math.floor(value)

    await window.ipcRenderer.invoke(
      'setBorderRadius',
      'BTime',
      `${fixedValue}px`
    )
    setSettingValue('borderRaduis', fixedValue)
  }

  if (!setting) return null

  return (
    <>
      <div className="p-2 mt-2 h-full not-moveable font-[Vazir]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between w-full gap-2">
            <Switch
              id={'time-startUp'}
              color={'blue'}
              defaultChecked={setting.enable}
              onClick={() =>
                setSettingValue('enable', setting.enable ? false : true)
              }
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
                    className="dark:text-gray-500 text-gray-600 text-[12px] font-[Vazir] mr-3"
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
              ripple={true}
              defaultChecked={setting.transparentStatus}
              onClick={() =>
                setSettingValue('transparentStatus', !setting.transparentStatus)
              }
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
              ripple={true}
              defaultChecked={setting.alwaysOnTop}
              onClick={() =>
                setSettingValue('alwaysOnTop', !setting.alwaysOnTop)
              }
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
          <div className="flex flex-col justify-between w-full gap-2">
            <label
              htmlFor="currency-select"
              className="text-gray-600 dark:text-[#eee] font-semibold text-sm"
            >
              حاشیه ها
            </label>
            <div className="flex items-center gap-2 w-36 h-fit rounded px-2 py-2">
              <Slider
                size="md"
                color="blue"
                defaultValue={setting.borderRaduis}
                onChange={(change) =>
                  onSliderChange(Number(change.target.value))
                }
              />
              <div className="flex flex-row justify-between w-full text-gray-600 dark:text-[#eee]">
                {setting.borderRaduis}px
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
