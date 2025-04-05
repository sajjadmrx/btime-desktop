import axios, { type AxiosInstance } from 'axios'
import type { FetchedAllEvents, News, Timezone } from './api.interface'
import type {
	FetchedWeather,
	ForecastResponse,
} from './hooks/weather/weather.interface'

const api = axios.create()
const rawGithubApi = axios.create({
	baseURL: 'https://raw.githubusercontent.com/sajjadmrx/btime-desktop/main',
})

export interface FetchedCurrency {
	code: string
	name: {
		fa: string
		en: string
	}
	icon: string
	price: number
	rialPrice: number
	changePercentage: number
	priceHistory: PriceHistory[]
	type: 'coin' | 'crypto' | 'currency'
}
export interface PriceHistory {
	price: number
	createdAt: string
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
): Promise<FetchedCurrency | null> {
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
		if ('currencies' in response.data) {
			return response.data.currencies
		}

		return response.data
	} catch (err) {
		console.log(err.response)
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

export async function getTodayEvents(): Promise<FetchedAllEvents> {
	try {
		api.defaults.baseURL = await getMainApi()

		api.defaults.headers.userid = window.store.get('main').userId

		const response = await api.get<FetchedAllEvents>('/date/events')
		return response.data
	} catch {
		return {
			shamsiEvents: [],
			gregorianEvents: [],
			hijriEvents: [],
		}
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
	const auth = await window.store.get('auth')
	if (import.meta.env.VITE_API) {
		return axios.create({
			baseURL: import.meta.env.VITE_API,
			headers: {
				authorization: auth?.token ? `Bearer ${auth.token}` : undefined,
			},
		})
	}

	const urlResponse = await rawGithubApi.get('/.github/api.txt')
	return axios.create({
		baseURL: urlResponse.data,
		headers: {
			authorization: auth?.token ? `Bearer ${auth.token}` : undefined,
		},
	})
}
