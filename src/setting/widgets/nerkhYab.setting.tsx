import { Checkbox, Switch, Typography } from '@material-tailwind/react'
import { NerkhYabSettingStore, widgetKey } from 'electron/store'
import { useEffect, useState } from 'react'

export function NerkhYabSetting() {
  const [setting, setSetting] = useState<NerkhYabSettingStore>(null)

  useEffect(() => {
    const NerkhYab: NerkhYabSettingStore = window.store.get(
      'NerkhYab' as widgetKey.NerkhYab
    )
    console.log(NerkhYab)
    setSetting(NerkhYab)
  }, [])

  function setSettingValue<T extends keyof NerkhYabSettingStore>(
    key: T,
    value: NerkhYabSettingStore[T]
  ) {
    setSetting((prev) => ({ ...prev, [key]: value }))
  }

  function onApplyChanges() {
    window.store.set('NerkhYab', {
      alwaysOnTop: setting.alwaysOnTop,
      enable: setting.enable,
      transparentStatus: setting.transparentStatus,
      bounds: window.store.get('NerkhYab' as widgetKey.NerkhYab).bounds,
      currencies: setting.currencies,
    })
  }
  if (!setting) return null
  return (
    <>
      <div className="mt-2 justify-around  not-moveable font-[Vazir]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between w-full gap-2">
            <Switch
              id={'nerkhyaab-enable'}
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

          <div
            className="flex flex-row items-center justify-between w-full gap-2"
            dir="rtl"
          >
            <div
              className="flex flex-col justify-between w-full gap-2"
              dir="rtl"
            >
              <label
                htmlFor="currency-select"
                className="text-gray-600 dark:text-[#eee] font-semibold"
              >
                انتخاب ارز:
              </label>
              <select
                id="currency-select"
                className="form-select block w-60 mr-2 h-11 mt-1 text-gray-600 dark:text-[#eee] bg-white dark:bg-gray-800
                 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none
                focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                onChange={(e) =>
                  setSettingValue('currencies', [e.target.value])
                }
                value={setting.currencies[0]}
              >
                <option value="usd" className="font-light">
                  دلار امریکا
                </option>
                <option value="eur" className="font-light">
                  یورو
                </option>
                <option value="gbp" className="font-light">
                  پوند انگلیس
                </option>
                <option value="cad" className="font-light">
                  دلار کانادا
                </option>
                <option value="aud" className="font-light">
                  دلار استرالیا
                </option>
                <option value="nzd" className="font-light">
                  دلار نیوزلند
                </option>
                <option value="hkd" className="font-light">
                  دلار هنگ کنگ
                </option>
                <option value="sgd" className="font-light">
                  دلار سنگاپور
                </option>
                <option value="inr" className="font-light">
                  دلار هند
                </option>
                <option value="jpy" className="font-light">
                  دلار ژاپن
                </option>
                <option value="cny" className="font-light">
                  دلار چین
                </option>
                <option value="krw" className="font-light">
                  دلار کره جنوبی
                </option>
              </select>
            </div>
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
