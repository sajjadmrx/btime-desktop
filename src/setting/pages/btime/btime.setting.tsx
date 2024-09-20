import { Checkbox, Slider, Switch, Typography } from '@material-tailwind/react'
import { BtimeSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../../../shared/widgetKey'
import { sendEvent } from '../../../api/api'

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

    if (!['borderRadius'].includes(key)) {
      sendEvent({
        name: `setting_${key}`,
        value: value,
        widget: widgetKey.NerkhYab,
      })
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
      <div className="p-2 mt-2 h-80 not-moveable font-[Vazir] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-800">
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
            <Checkbox
              ripple={true}
              defaultChecked={setting.showDayEvents}
              onClick={() =>
                setSettingValue('showDayEvents', !setting.showDayEvents)
              }
              label={
                <div>
                  <Typography
                    variant={'h5'}
                    color="blue-gray"
                    className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir] items-center "
                  >
                    نمایش مناسبت های روز و اعلانات{' '}
                    <span className="font-light">
                      (نمایش مناسبت های روز و اعلانات در زیر ویجت)
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
              defaultChecked={setting.showCalendar}
              onClick={() =>
                setSettingValue('showCalendar', !setting.showCalendar)
              }
              label={
                <div>
                  <Typography
                    variant={'h5'}
                    color="blue-gray"
                    className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir] items-center "
                  >
                    نمایش تقویم{' '}
                    <span className="font-light">
                      (نمایش روزهای ماه در سمت جپ ویجت)
                    </span>
                  </Typography>
                </div>
              }
              containerProps={{
                className: 'flex',
              }}
            />
          </div>
          <div className="w-full">
            <label className="text-gray-600 dark:text-[#eee] font-semibold text-sm">
              نوع تقویم
            </label>
            <div className="flex mt-2 gap-2 w-full h-14 rounded-lg px-2 py-2 dark:bg-[#464545] bg-[#e8e6e6]">
              <CalendarItem
                title="جلالی"
                selected={setting.currentCalender === 'Jalali'}
                onClick={() => setSettingValue('currentCalender', 'Jalali')}
              />
              <CalendarItem
                title="میلادی"
                selected={setting.currentCalender === 'Gregorian'}
                onClick={() => setSettingValue('currentCalender', 'Gregorian')}
              />
            </div>

            <div className="text-gray-600 dark:text-gray-300 text-sm p-2 bg-[#e8e6e6] dark:bg-[#24242459] rounded-lg mt-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 ml-1"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>{' '}
              <p className="font-light">
                برای نمایش تقویم، ویجت رو در سایز مناسب قرار بدید.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between w-full">
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

function CalendarItem({ title, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-full h-10 flex justify-center items-center rounded-lg text-gray-600 dark:text-[#eee] cursor-pointer ${
        selected
          ? 'bg-[#f5f5f5] dark:bg-[#3a3a3a]'
          : `hover:bg-[#f5f5f578] dark:hover:bg-[#3a3a3a5c]`
      } 
        ${selected && 'text-gray-600 dark:text-gray-300'}
        transition-all  ease-in-out duration-2000`}
    >
      {title}
    </div>
  )
}
