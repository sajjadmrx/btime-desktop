import axios from 'axios'

const nerkhApi = axios.create()
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
    nerkhApi.defaults.baseURL = urlResponse.data

    const response = await nerkhApi.get(`/arz/${currency}`)
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
    nerkhApi.defaults.baseURL = urlResponse.data

    const response = await nerkhApi.get('/supported-currencies')

    return response.data.countryFlagMapping
  } catch (err) {
    console.log(err)
    return null
  }
}
