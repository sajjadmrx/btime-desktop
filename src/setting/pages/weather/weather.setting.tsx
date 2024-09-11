import {
  Checkbox,
  Slider,
  Spinner,
  Switch,
  Typography,
} from '@material-tailwind/react'
import { WeatherSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { getRelatedCities } from '../../../api/api'
import { RelatedCitiy } from './interface'
import { RelatedCityComponent } from './relatedCity'
import { widgetKey } from '../../../../shared/widgetKey'

export function WeatherSetting() {
  const [setting, setSetting] = useState<WeatherSettingStore>(null)
  const [relatedCities, setRelatedCities] = useState<RelatedCitiy[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const Weather: WeatherSettingStore = window.store.get(widgetKey.Weather)
    Weather.borderRaduis = Weather.borderRaduis || 28
    setSetting(Weather)
    setRelatedCities([])
  }, [])

  function setSettingValue<T extends keyof WeatherSettingStore>(
    key: T,
    value: WeatherSettingStore[T]
  ) {
    setting[key] = value
    setSetting({ ...setting })
    applyChanges()
    if (key == 'transparentStatus') {
      window.ipcRenderer.send('toggle-transparent', widgetKey.Weather)
    }
  }

  // when click to document, close the related cities
  useEffect(() => {
    const closeRelatedCities = (e: MouseEvent) => {
      if (e.target instanceof Element) {
        if (!e.target.closest('.related-city')) {
          setRelatedCities([])
        }
      }
    }
    document.addEventListener('click', closeRelatedCities)
    return () => {
      document.removeEventListener('click', closeRelatedCities)
    }
  }, [])

  function applyChanges() {
    window.store.set(widgetKey.Weather, {
      alwaysOnTop: setting.alwaysOnTop,
      enable: setting.enable,
      transparentStatus: setting.transparentStatus,
      bounds: window.store.get('Weather' as widgetKey.Weather).bounds,
      city: setting.city,
      borderRaduis: setting.borderRaduis,
    })
  }

  async function onChangeCityInput(event: React.ChangeEvent<HTMLInputElement>) {
    await new Promise((resolve) => setTimeout(resolve, 500)) //wait for user to stop typing

    const value = event.target.value
    if (!value) {
      setRelatedCities([])
      return
    }
    if (value.length < 2) return
    if (value === setting.city?.name) return
    setLoading(true)
    try {
      const cities = await getRelatedCities(value)
      setRelatedCities(cities)
    } finally {
      setLoading(false)
    }
  }

  function selectedCity(city: RelatedCitiy) {
    setRelatedCities([...new Set([])])
    setSettingValue('city', {
      lat: city.lat,
      lon: city.lon,
      name: city.name,
    })
    applyChanges()
  }

  async function onSliderChange(value: number) {
    const fixedValue = Math.floor(value)

    await window.ipcRenderer.invoke(
      'setBorderRadius',
      widgetKey.Weather,
      `${fixedValue}px`
    )
    setSettingValue('borderRaduis', fixedValue)
  }

  if (!setting) return null
  return (
    <>
      <div className="p-2 mt-2 h-80 not-moveable font-[Vazir] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-800">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between w-full gap-2">
            <Switch
              id={'weather-enable'}
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
                    فعالسازی ویجت آب و هوا
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

          <div className="flex flex-col justify-between w-full ">
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

          <div
            className="flex flex-col items-center justify-between w-full gap-2 relative"
            dir="rtl"
          >
            <div
              className="flex flex-col justify-between w-full gap-2 relative not-moveable"
              dir="rtl"
            >
              <label
                htmlFor="city-select"
                className="text-gray-600 dark:text-[#eee] font-semibold"
              >
                انتخاب شهر
              </label>
              <input
                type="text"
                id="city-select"
                className="w-full bg-gray-100 dark:bg-[#3e3e3e] dark:text-[#eee] text-gray-600 text-[13px]
                 font-[Vazir] rounded-md p-2
                 outline-none border-2 border-gray-200 dark:border-[#444] transition-all duration-300
                  focus:ring-0 focus:ring-blue-500 focus:border-blue-500
                  placeholder-gray-600 focus:placeholder-gray-500
                 "
                defaultValue={setting.city?.name}
                onChange={onChangeCityInput}
                placeholder="نام شهر را وارد کنید ... (فارسی یا انگلیسی)"
              />
              {loading ? (
                <div
                  className="w-10 h-10  
              absolute bottom-0 left-1 transition-all duration-300
              rounded-full z-0 flex justify-center items-center
              "
                >
                  <Spinner className="h-4 w-4" />
                </div>
              ) : (
                ''
              )}
            </div>
            <div className="flex flex-col items-center justify-between w-full">
              {setting.city ? (
                <div
                  className="flex flex-row items-center justify-between w-full"
                  dir="rtl"
                >
                  <div className="flex items-center gap-1 bg-gray-200/40 dark:bg-[#444]/40 p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4 dark:text-[#e8e7e7] text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                      />
                    </svg>

                    <span className="text-gray-600 dark:text-[#eee] text-[13px] font-[Vazir]">
                      {setting.city.name}
                    </span>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
            {relatedCities.length ? (
              <div
                className="flex flex-row flex-wrap absolute not-moveable
                 w-full gap-2
                  border-2 border-gray-200 dark:border-[#444] 
                  bg-gray-100 dark:bg-[#333] dark:text-[#eee]
                  transform translate-y-20
                  z-10 rounded transition-all duration-300
                 h-32 px-2 py-2 overflow-y-scroll scrollbar-thin
               scrollbar-thumb-gray-300 scrollbar-track-gray-100
                dark:scrollbar-thumb-gray-500
                 dark:scrollbar-track-gray-800
                 "
              >
                {relatedCities.map((city) => (
                  <RelatedCityComponent
                    key={city.name + '-' + city.lat}
                    city={city}
                    selectedCity={selectedCity}
                  />
                ))}
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  )
}
