import { Checkbox, Switch, Typography } from '@material-tailwind/react'
import { BtimeSettingStore, widgetKey } from 'electron/store'
import { useEffect, useState } from 'react'

export function BtimeSetting() {
  const [setting, setSetting] = useState<BtimeSettingStore>(null)

  useEffect(() => {
    const btime: BtimeSettingStore = window.store.get(
      'BTime' as widgetKey.BTime
    )
    console.log(btime)
    setSetting(btime)
  }, [])

  function setSettingValue<T extends keyof BtimeSettingStore>(
    key: T,
    value: BtimeSettingStore[T]
  ) {
    setSetting((prev) => ({ ...prev, [key]: value }))
  }

  function onApplyChanges() {
    window.store.set('BTime' as widgetKey.BTime, {
      alwaysOnTop: setting.alwaysOnTop,
      enable: setting.enable,
      transparentStatus: setting.transparentStatus,
      bounds: window.store.get('Btime' as widgetKey.BTime).bounds,
    })
  }
  if (!setting) return null

  return (
    <>
      <div className="mt-2 justify-around  not-moveable font-[Vazir]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between w-full gap-2">
            <Switch
              id={'time-startUp'}
              color={'blue'}
              defaultChecked={setting.enable}
              onClick={() => setSettingValue('enable', !setting.enable)}
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
        </div>
        <div className="flex flex-row justify-center mt-7">
          <button
            type="button"
            className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4 w-40 
            transition duration-300 ease-in-out transform hover:bg-blue-600 focus:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hover:scale-105
            "
            onClick={onApplyChanges}
          >
            ذخیره
          </button>
        </div>
      </div>
    </>
  )
}
