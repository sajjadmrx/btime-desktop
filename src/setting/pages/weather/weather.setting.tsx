import {
	Checkbox,
	Slider,
	Spinner,
	Switch,
	Typography,
} from '@material-tailwind/react'
import type { WeatherSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { widgetKey } from '../../../../shared/widgetKey'
import { sendEvent } from '../../../api/api'
import { useGetRelatedCities } from '../../../api/hooks/weather/getRelatedCities'
import type { RelatedCities } from './interface'
import { RelatedCityComponent } from './relatedCity'

export function WeatherSetting() {
	const [setting, setSetting] = useState<WeatherSettingStore>(null)
	const [relatedCities, setRelatedCities] = useState<RelatedCities[]>([])
	const [loading, setLoading] = useState(false)
	const [cityInput, setCityInput] = useState('')

	useEffect(() => {
		const Weather: WeatherSettingStore = window.store.get(widgetKey.Weather)
		Weather.borderRadius = Weather.borderRadius || 28
		setSetting(Weather)
		setRelatedCities([])
	}, [])

	function setSettingValue<T extends keyof WeatherSettingStore>(
		key: T,
		value: WeatherSettingStore[T],
	) {
		setting[key] = value
		setSetting({ ...setting })
		applyChanges()

		if (key === 'transparentStatus') {
			window.ipcRenderer.send('toggle-transparent', widgetKey.Weather)
		}

		if (key === 'disableBackground') {
			window.ipcRenderer.send('toggle-disableBackground', widgetKey.Weather)
		}

		if (!['borderRadius'].includes(key)) {
			sendEvent({
				name: `setting_${key}`,
				value: value,
				widget: widgetKey.Weather,
			})
		}

		if (key === 'enable') {
			window.ipcRenderer.send('toggle-enable', widgetKey.Weather)
		} else if (
			!['transparentStatus', 'borderRadius', 'disableBackground'].includes(key)
		) {
			window.ipcRenderer.send('updated-setting', widgetKey.Weather)
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
		window.store.set<widgetKey, WeatherSettingStore>(widgetKey.Weather, {
			...setting,
			alwaysOnTop: setting.alwaysOnTop,
			enable: setting.enable,
			transparentStatus: setting.transparentStatus,
			bounds: window.store.get('Weather' as widgetKey.Weather).bounds,
			city: setting.city,
			borderRadius: setting.borderRadius,
		})
	}

	async function onChangeCityInput(event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		setCityInput(value)
	}

	const { data: cities, isLoading } = useGetRelatedCities(cityInput)

	useEffect(() => {
		if (cities) {
			setRelatedCities(cities)
		}
	}, [cities])

	function selectedCity(city: RelatedCities) {
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
			`${fixedValue}px`,
		)
		setSettingValue('borderRadius', fixedValue)
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
										className="dark:text-[#c7c7c7] text-gray-600  text-[13px] font-[Vazir]"
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
							defaultChecked={setting.stateColor}
							onClick={() => setSettingValue('stateColor', !setting.stateColor)}
							label={
								<div>
									<Typography
										variant={'h5'}
										color="blue-gray"
										className="dark:text-[#c7c7c7] text-gray-600  text-[13px] font-[Vazir]"
									>
										رنگ وضعیت
									</Typography>
								</div>
							}
							containerProps={{
								className: 'flex',
							}}
						/>
						<Checkbox
							ripple={true}
							defaultChecked={setting.disableBackground}
							onClick={() =>
								setSettingValue('disableBackground', !setting.disableBackground)
							}
							label={
								<div>
									<Typography
										variant={'h5'}
										color="blue-gray"
										className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir] items-center "
									>
										غیرفعال کردن پشت زمینه{' '}
										<span className="font-light">
											(غیرفعال کردن نمایش پشت زمینه برای ویجت)
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
					</div>

					<div className="flex flex-col justify-between w-full ">
						<label
							htmlFor="currency-select"
							className="text-gray-600 dark:text-[#eee] font-semibold text-sm"
						>
							حاشیه ها
						</label>
						<div className="flex items-center gap-2 px-2 py-2 rounded w-36 h-fit">
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

					<div
						className="relative flex flex-col items-center justify-between w-full gap-2"
						dir="rtl"
					>
						<div
							className="relative flex flex-col justify-between w-full gap-2 not-moveable"
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
							{isLoading ? (
								<div className="absolute bottom-0 z-0 flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full left-1 ">
									<Spinner className="w-4 h-4" />
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
										key={`${city.name}-${city.lat}`}
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
