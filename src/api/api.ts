import axios, { type AxiosInstance } from 'axios'
import type { News, Timezone, TodayEvent } from './api.interface'
import type {
	FetchedWeather,
	ForecastResponse,
} from './hooks/weather/weather.interface'

const api = axios.create()
const rawGithubApi = axios.create({
	baseURL: 'https://raw.githubusercontent.com/sajjadmrx/btime-desktop/main',
})

export interface CurrencyData {
	name: {
		fa: string
		en: string
	}
	icon: string
	price: number
	rialPrice: number
}

export interface History {
	date: string
	price: number
	rate: string
	low: number
	high: number
}

export async function getRateByCurrency(
	currency: string,
): Promise<CurrencyData | null> {
	try {
		api.defaults.baseURL = await getMainApi()

		api.defaults.headers.userid = window.store.get('main').userId

		const response = await api.get(`/v2/arz/${currency}`)
		return response.data
	} catch (err) {
		console.log(err)
		return null
	}
}

export type SupportedCurrencies = {
	key: string
	type: 'coin' | 'crypto' | 'currency'
	country?: string
	label: {
		fa: string
		en: string
	}
}[]

export async function getSupportedCurrencies(): Promise<SupportedCurrencies> {
	try {
		api.defaults.baseURL = await getMainApi()

		api.defaults.headers.userid = window.store.get('main').userId

		const response = await api.get('/currencies/supported-list')
		return response.data
	} catch (err) {
		console.log(err)
		return []
	}
}

export interface MonthEvent {
	date: string
	event: string
	isHoliday: boolean
	day: string
}
export async function getMonthEvents(): Promise<MonthEvent[]> {
	api.defaults.baseURL = await getMainApi()
	try {
		api.defaults.headers.userid = window.store.get('main').userId

		const response = await api.get('/date/month')
		return response.data
	} catch {
		return []
	}
}

export async function getTimezones(): Promise<Timezone[]> {
	try {
		api.defaults.baseURL = await getMainApi()

		api.defaults.headers.userid = window.store.get('main').userId

		const response = await api.get('/date/timezones')
		return response.data
	} catch {
		return []
	}
}
export async function getNotifications() {
	try {
		api.defaults.baseURL = await getMainApi()

		api.defaults.headers.userid = window.store.get('main').userId

		const response = await api.get('/notifications')
		return response.data
	} catch {
		return null
	}
}

export async function getTodayEvents(): Promise<TodayEvent[]> {
	try {
		api.defaults.baseURL = await getMainApi()

		api.defaults.headers.userid = window.store.get('main').userId

		const response = await api.get<{
			todayEvents: TodayEvent[]
		}>('/date/todoy-events')
		return response.data.todayEvents
	} catch {
		return []
	}
}

export async function getOurNews(): Promise<News[]> {
	try {
		api.defaults.baseURL = await getMainApi()

		api.defaults.headers.userid = window.store.get('main').userId

		const response = await api.get('/news')
		return response.data
	} catch {
		return []
	}
}

export async function getAppLogo(): Promise<string | null> {
	try {
		api.defaults.baseURL = await getMainApi()
		const response = await api.get('/logo')
		return response.data
	} catch {
		return null
	}
}

export async function getMainApi(): Promise<string> {
	if (import.meta.env.VITE_API) {
		return import.meta.env.VITE_API
	}

	const urlResponse = await rawGithubApi.get('/.github/api.txt')
	return urlResponse.data
}

export async function getMainClient(): Promise<AxiosInstance> {
	if (import.meta.env.VITE_API) {
		return axios.create({
			baseURL: import.meta.env.VITE_API,
		})
	}

	const urlResponse = await rawGithubApi.get('/.github/api.txt')
	return axios.create({
		baseURL: urlResponse.data,
	})
}
