import { randomUUID } from 'node:crypto'
import electronStore from 'electron-store'
import type { AuthData } from '../shared/user.interface'
import { widgetKey } from '../shared/widgetKey'
import type { FetchedCurrency } from '../src/api/api'

export interface windowSettings {
	bounds: {
		x: number
		y: number
		width: number
		height: number
		minWidth: number
		minHeight: number
		maxWidth?: number
		maxHeight?: number
	}
	alwaysOnTop: boolean
	enable: boolean
	html: string
}

export interface BtimeSettingStore extends windowSettings {
	currentCalender: 'Jalali' | 'Gregorian'
	showDayEvents: boolean
	showCalendar: boolean
}
export interface NerkhYabSettingStore extends windowSettings {
	currencies: string[]
}

export interface ArzChandSettingStore extends windowSettings {
	currencies: string[]
	template: 'classic' | 'default'
}

export interface WeatherSettingStore extends windowSettings {
	city: {
		lat: number
		lon: number
		name: string
	}
	stateColor: boolean
}

export interface DamDastiSettingStore extends windowSettings {}
export interface SubShomaarSettingStore extends windowSettings {
	channelName: string
	subscriberFormat: 'short' | 'full'
}
export interface AnalogClockASettingStore {
	timzones: {
		label: string
		value: string
	}[]
	showAllHours: boolean
	showTimeZone: boolean
}
export interface DigitalClockSettingStore {
	timeZone: {
		label: string
		value: string
	}
	showSecond: boolean
	showDate: boolean
	showTimeZone: boolean
}

export interface ClockSettingStore extends windowSettings {
	currentClock: 'digital' | 'analogA'
	digital: DigitalClockSettingStore
	analogA: AnalogClockASettingStore
}
export interface MainSettingStore {
	startup: boolean
	theme: Theme
	moveable: boolean
	currentVersion: string
	enableAnalytics: boolean
	userId: string
}
export type Theme = 'system' | 'light' | 'dark'

export interface StoreKey {
	[widgetKey.BTime]: BtimeSettingStore
	[widgetKey.NerkhYab]: NerkhYabSettingStore
	[widgetKey.ArzChand]: ArzChandSettingStore
	[widgetKey.Weather]: WeatherSettingStore
	[widgetKey.Clock]: ClockSettingStore
	[widgetKey.DamDasti]: DamDastiSettingStore
	[widgetKey.SubShomaar]: SubShomaarSettingStore
	[key: `currency:${string}`]: FetchedCurrency
	main: MainSettingStore
	auth: AuthData | null
}

const storeDefaults: StoreKey = {
	BTime: {
		enable: true,
		bounds: {
			x: 0,
			y: 0,
			width: 441,
			height: 265,
			minHeight: 150,
			minWidth: 150,
			maxHeight: 266,
			maxWidth: 510,
		},
		currentCalender: 'Jalali',
		showCalendar: true,
		showDayEvents: true,
		alwaysOnTop: false,
		html: 'time.html',
	},
	NerkhYab: {
		enable: true,
		bounds: {
			x: 0,
			y: 0,
			width: 226,
			height: 134,
			minHeight: 120,
			minWidth: 226,
		},
		alwaysOnTop: false,
		html: 'rate.html',
		currencies: ['usd'],
	},
	ArzChand: {
		enable: false,
		bounds: {
			x: 0,
			y: 0,
			width: 226,
			height: 134,
			minHeight: 110,
			minWidth: 110,
			maxWidth: 410,
			maxHeight: 319,
		},
		alwaysOnTop: false,
		html: 'arzchand.html',
		currencies: ['usd', 'eur'],
		template: 'classic',
	},
	Weather: {
		enable: false,
		bounds: {
			x: 0,
			y: 0,
			width: 183,
			height: 203,
			minHeight: 203,
			minWidth: 183,
		},
		alwaysOnTop: false,
		city: null,
		stateColor: true,
		html: 'weather.html',
	},
	Clock: {
		currentClock: 'digital',
		alwaysOnTop: false,
		bounds: {
			width: 217,
			height: 180,
			x: 0,
			y: 0,
			minWidth: 150,
			minHeight: 76,
		},
		enable: false,
		analogA: {
			showAllHours: false,
			showTimeZone: true,
			timzones: [
				{
					label: 'آسیا / تهران',
					value: 'Asia/Tehran',
				},
			],
		},
		digital: {
			showDate: true,
			showSecond: true,
			showTimeZone: true,
			timeZone: {
				label: 'آسیا / تهران',
				value: 'Asia/Tehran',
			},
		},
		html: 'clock.html',
	},
	DamDasti: {
		alwaysOnTop: false,
		bounds: {
			width: 217,
			height: 180,
			x: 0,
			y: 0,
			minWidth: 150,
			minHeight: 76,
		},
		enable: false,
		html: 'dam-dasti.html',
	},
	main: {
		userId: randomUUID(),
		enableAnalytics: true,
		startup: true,
		theme: 'light',
		moveable: true,
		currentVersion: null,
	},
	SubShomaar: {
		alwaysOnTop: false,
		bounds: {
			width: 217,
			height: 180,
			x: 0,
			y: 0,
			minWidth: 150,
			minHeight: 76,
		},
		enable: false,
		html: 'sub-shomaar.html',
		channelName: null,
		subscriberFormat: 'short',
	},
	auth: null,
}

export const store = new electronStore<StoreKey>({
	defaults: storeDefaults,
	accessPropertiesByDotNotation: true,
	name: 'widgetify-app',
})
const clockWidgetStoreData = store.get(widgetKey.Clock)

if (typeof clockWidgetStoreData.analogA === 'undefined') {
	store.set(widgetKey.Clock, {
		...clockWidgetStoreData,
		currentClock: 'digital',
		analogA: {
			showAllHours: false,
			showTimeZone: true,
			timzones: [
				{
					label: 'آسیا / تهران',
					value: 'Asia/Tehran',
				},
			],
		},
		digital: {
			showDate: true,
			showSecond: true,
			showTimeZone: true,
			timeZone: {
				label: 'آسیا / تهران',
				value: 'Asia/Tehran',
			},
		},
	})
}
