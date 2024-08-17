import axios from 'axios'

const nerkhApi = axios.create({
  baseURL: 'https://btime.liara.run/arz',
})

export interface CurrencyData {
  name: string
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
    const response = await nerkhApi.get(`/${currency}`)
    return response.data
  } catch (err) {
    console.log(err)
    return null
  }
}
