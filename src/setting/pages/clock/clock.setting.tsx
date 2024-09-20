import { Checkbox, Slider, Switch, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../../../shared/widgetKey'
import { ClockSettingStore } from 'electron/store'
import { Timezone } from '../../../api/api.interface'
import { getTimezones, sendEvent } from '../../../api/api'

export function ClockSetting() {
  const [setting, setSetting] = useState<ClockSettingStore>(null)
  const [timezones, setTimeZones] = useState<Timezone[]>([])

  useEffect(() => {
    const clock: ClockSettingStore = window.store.get(widgetKey.Clock)
    clock.borderRadius = clock.borderRadius || 28
    setSetting(clock)

    function fetchTimezones() {
      getTimezones().then((data) => {
        setTimeZones(data)
      })
    }

    fetchTimezones()
    return () => {
      fetchTimezones()
    }
  }, [])

  function setSettingValue<T extends keyof ClockSettingStore>(
    key: T,
    value: ClockSettingStore[T]
  ) {
    setting[key] = value
    setSetting({ ...setting })
    applyChanges()
    if (key == 'transparentStatus') {
      window.ipcRenderer.send('toggle-transparent', widgetKey.Clock)
    }

    if (!['borderRadius'].includes(key)) {
      sendEvent({
        name: `setting_${key}`,
        value: value,
        widget: widgetKey.NerkhYab,
      })
    }

    if (key === 'enable') {
      window.ipcRenderer.send('toggle-enable', widgetKey.Clock)
    } else if (!['transparentStatus', 'borderRadius'].includes(key)) {
      window.ipcRenderer.send('updated-setting', widgetKey.Clock)
    }
  }

  function applyChanges() {
    window.store.set<widgetKey.Clock, ClockSettingStore>(widgetKey.Clock, {
      ...setting,
      alwaysOnTop: setting.alwaysOnTop,
      enable: setting.enable,
      transparentStatus: setting.transparentStatus,
      bounds: window.store.get(widgetKey.Clock).bounds,
      borderRadius: setting.borderRadius,
      showDate: setting.showDate,
      showSecond: setting.showSecond,
      showTimeZone: setting.showTimeZone,
      timeZone: setting.timeZone,
    })
  }

  async function onSliderChange(value: number) {
    const fixedValue = Math.floor(value)

    await window.ipcRenderer.invoke(
      'setBorderRadius',
      'Clock',
      `${fixedValue}px`
    )
    setSettingValue('borderRadius', fixedValue)
  }

  if (!setting) return null

  return (
    <>
      <div className="p-2 mt-2 h-80 not-moveable font-[Vazir] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-800">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between w-full gap-2">
            <Switch
              id={'clock-startUp'}
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
                    فعالسازی ویجت ساعت
                  </Typography>
                </div>
              }
              containerProps={{
                className: '-mt-5 mr-2',
              }}
            />
          </div>
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
                    className="dark:text-[#c7c7c7] text-gray-600  text-[13px] font-[Vazir] font-normal"
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
                    className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir]"
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
            <Checkbox
              ripple={true}
              defaultChecked={setting.showSecond}
              onClick={() => setSettingValue('showSecond', !setting.showSecond)}
              label={
                <div>
                  <Typography
                    variant={'h5'}
                    color="blue-gray"
                    className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir]"
                  >
                    نمایش ثانیه{' '}
                    <span className="font-light">(نمایش ثانیه در ساعت)</span>
                  </Typography>
                </div>
              }
              containerProps={{
                className: 'flex',
              }}
            />
            <Checkbox
              ripple={true}
              defaultChecked={setting.showTimeZone}
              onClick={() =>
                setSettingValue('showTimeZone', !setting.showTimeZone)
              }
              label={
                <div>
                  <Typography
                    variant={'h5'}
                    color="blue-gray"
                    className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir]"
                  >
                    نمایش منطقه زمانی{' '}
                    <span className="font-light">
                      (نمایش منطقه زمانی در ساعت)
                    </span>
                  </Typography>
                </div>
              }
              containerProps={{
                className: 'flex',
              }}
            />
            <Checkbox
              ripple={true}
              defaultChecked={setting.showDate}
              onClick={() => setSettingValue('showDate', !setting.showDate)}
              label={
                <div>
                  <Typography
                    variant={'h5'}
                    color="blue-gray"
                    className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir]"
                  >
                    نمایش تاریخ{' '}
                    <span className="font-light">(نمایش تاریخ در ساعت)</span>
                  </Typography>
                </div>
              }
              containerProps={{
                className: 'flex',
              }}
            />
          </div>
          <div className="flex flex-col w-full gap-2" dir="rtl">
            <label
              htmlFor="currency-select"
              className="text-gray-600 dark:text-[#eee] font-semibold"
            >
              انتخاب منطقه زمانی:
            </label>
            <select
              id="currency-select"
              className="form-select block w-80 mr-2 h-11 mt-1 text-gray-600 dark:text-[#eee] bg-white dark:bg-gray-800
                 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none
                focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 px-3"
              onChange={(e) =>
                setSettingValue(
                  'timeZone',
                  getTimeZoneItem(timezones, e.target.value)
                )
              }
              value={setting?.timeZone.value}
              disabled={timezones.length === 0}
            >
              {timezones.map((timezone: Timezone, index) => (
                <option
                  key={index}
                  value={timezone.value}
                  className="font-light"
                >
                  {timezone.label} ( {timezone.offset} )
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col  w-full gap-2">
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
          <div className="w-full">
            <label className="text-gray-600 dark:text-[#eee] font-semibold text-sm">
              قالب ساعت
            </label>
            <div className="flex mt-2 gap-2 w-full h-14 rounded-lg px-2 py-2 dark:bg-[#464545] bg-[#e8e6e6]">
              <div
                className={`w-full h-10 flex justify-center items-center rounded-lg text-gray-600 dark:text-[#eee] cursor-pointer bg-[#f5f5f5] dark:bg-[#3a3a3a] `}
              >
                دیجیتال 1
              </div>
              <div
                className={`w-full h-10 flex justify-center items-center rounded-lg text-gray-600 opacity-60 dark:text-[#eee]`}
              >
                به‌زودی
              </div>
              <div
                className={`w-full h-10 flex justify-center items-center rounded-lg text-gray-600 opacity-60 dark:text-[#eee]`}
              >
                به‌زودی
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function getTimeZoneItem(timezoes: Timezone[], value: string) {
  return timezoes.find((timezone) => timezone.value === value)
}
