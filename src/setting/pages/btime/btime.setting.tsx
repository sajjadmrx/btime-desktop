import { Checkbox, Slider, Switch, Typography } from '@material-tailwind/react'
import { BtimeSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../../../shared/widgetKey'

export function BtimeSetting() {
  const [setting, setSetting] = useState<BtimeSettingStore>(null)
  useEffect(() => {
    const btime: BtimeSettingStore = window.store.get(widgetKey.BTime)
    btime.borderRadius = btime.borderRadius || 28
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
    if (key === 'enable') {
      window.ipcRenderer.send('toggle-enable', widgetKey.BTime)
    } else if (!['transparentStatus', 'borderRadius'].includes(key)) {
      window.ipcRenderer.send('updated-setting', widgetKey.BTime)
    }
  }

  function applyChanges() {
    window.store.set<widgetKey, BtimeSettingStore>(widgetKey.BTime, {
      ...setting,
      alwaysOnTop: setting.alwaysOnTop,
      enable: setting.enable,
      transparentStatus: setting.transparentStatus,
      bounds: window.store.get(widgetKey.BTime).bounds,
      borderRadius: setting.borderRadius,
    })
  }

  async function onSliderChange(value: number) {
    const fixedValue = Math.floor(value)

    await window.ipcRenderer.invoke(
      'setBorderRadius',
      'BTime',
      `${fixedValue}px`
    )
    setSettingValue('borderRadius', fixedValue)
  }

  if (!setting) return null

  return (
    <>
      <div className="p-2 mt-2 h-full not-moveable font-[Vazir]">
        <div className="flex flex-col gap-4">
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
                  className="text-gray-600  dark:text-[#c7c7c7] text-[13px] font-[Vazir] mr-3"
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
          <div className="flex flex-col">
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
                    className="dark:text-[#c7c7c7] text-gray-600  text-[13px] font-[Vazir] items-center "
                  >
                    شفاف <span className="font-light">(پس زمینه شفاف)</span>
                  </Typography>
                </div>
              }
              containerProps={{
                className: 'flex',
              }}
            />
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
                    className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir] items-center "
                  >
                    اولویت بالا{' '}
                    <span className="font-light">(همیشه بالای همه باشد)</span>
                  </Typography>
                </div>
              }
              containerProps={{
                className: 'flex',
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
                defaultValue={setting.borderRadius}
                onChange={(change) =>
                  onSliderChange(Number(change.target.value))
                }
              />
              <div className="flex flex-row justify-between w-full text-gray-600 dark:text-[#eee]">
                {setting.borderRadius}px
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
