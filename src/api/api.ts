import axios from 'axios'
import { ForecastResponse, WeatherResponse } from './weather.interface'

const api = axios.create()
const rawGithubApi = axios.create({
  baseURL: 'https://raw.githubusercontent.com/sajjadmrx/btime-desktop/main',
})

export interface CurrencyData {
  name: string
  icon: string
  todyPrice: number
}

export interface History {
  date: string
  price: number
  rate: string
  low: number
  high: number
}

export async function getRateByCurrency(
  currency: string
): Promise<CurrencyData | null> {
  try {
    api.defaults.baseURL = await getMainApi()

    const response = await api.get(`/arz/${currency}`)
    return response.data
  } catch (err) {
    console.log(err)
    return null
  }
}

export type SupportedCurrencies = Record<
  string,
  {
    flag: string
    country: string
    label: string
  }
>
export async function getSupportedCurrencies(): Promise<SupportedCurrencies> {
  try {
    api.defaults.baseURL = await getMainApi()

    const response = await api.get('/supported-currencies')

    return response.data.countryFlagMapping
  } catch (err) {
    console.log(err)
    return {}
  }
}

export async function getWeatherByCity(
  city: string
): Promise<WeatherResponse | null> {
  try {
    api.defaults.baseURL = await getMainApi()

    const response = await api.get(`/weather/current?city=${city}`)
    return response.data
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getWeatherByLatLon(
  lat: number,
  lon: number
): Promise<WeatherResponse | null> {
  api.defaults.baseURL = await getMainApi()

  const response = await api.get(`/weather/current?lat=${lat}&lon=${lon}`)
  return response.data
}

export async function getWeatherForecastByLatLon(
  lat: number,
  lon: number
): Promise<ForecastResponse[]> {
  try {
    api.defaults.baseURL = await getMainApi()

    const response = await api.get(`/weather/forecast?lat=${lat}&lon=${lon}`)
    return response.data
  } catch {
    return []
  }
}

export async function getRelatedCities(city: string): Promise<any[]> {
  try {
    api.defaults.baseURL = await getMainApi()

    const response = await api.get(`/weather/direct?q=${city}`)
    return response.data
  } catch (err) {
    console.log(err)
    return []
  }
}

export async function getSponsors() {
  api.defaults.baseURL = await getMainApi()
  console.log('api.defaults.baseURL', api.defaults.baseURL)
  const response = await api.get('/sponsors')
  return response.data
}

export interface MonthEvent {
  date: string
  event: string
  isHoliday: boolean
  day: string
}
export async function getMonthEvents(): Promise<MonthEvent[]> {
  //mock delay
  await new Promise((resolve) => setTimeout(resolve, 8000))
  api.defaults.baseURL = await getMainApi()
  try {
    const response = await api.get('/date/month')
    return response.data
  } catch {
    return []
  }
}

export async function getNotifications() {
  try {
    api.defaults.baseURL = await getMainApi()
    const response = await api.get('/notifications')
    return response.data
  } catch {
    return null
  }
}

async function getMainApi(): Promise<string> {
  if (import.meta.env.VITE_API) {
    return import.meta.env.VITE_API
  }

  const urlResponse = await rawGithubApi.get('/.github/api.txt')
  return urlResponse.data
}
