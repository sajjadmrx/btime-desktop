import axios from 'axios'
import { WeatherResponse } from './weather.interface'

const api = axios.create()
const rawGithubApi = axios.create({
  baseURL: 'https://raw.githubusercontent.com/sajjadmrx/btime-desktop/main',
})

export interface CurrencyData {
  name: string
  icon: string
  todyPrice: number
  buyPercentage: number
  rate: number
  convertRate: number
  priceChange: number
  rateChange: number
  history: History[]
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
    const urlResponse = await rawGithubApi.get('/.github/api.txt')
    api.defaults.baseURL = urlResponse.data

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
    const urlResponse = await rawGithubApi.get('/.github/api.txt')
    api.defaults.baseURL = urlResponse.data

    const response = await api.get('/supported-currencies')

    return response.data.countryFlagMapping
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getWeatherByCity(
  city: string
): Promise<WeatherResponse | null> {
  try {
    // const urlResponse = await rawGithubApi.get('/.github/api.txt')
    // api.defaults.baseURL = urlResponse.data

    const response = await axios.get(
      `http://localhost:3000/weather/current?city=${city}`
    )
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
  const response = await axios.get(
    `http://localhost:3000/weather/current?lat=${lat}&lon=${lon}`
  )
  return response.data
}

export async function getRelatedCities(city: string): Promise<any[]> {
  try {
    const response = await axios.get(
      `http://localhost:3000/weather/direct?q=${city}`
    )
    return response.data
  } catch (err) {
    console.log(err)
    return []
  }
}
