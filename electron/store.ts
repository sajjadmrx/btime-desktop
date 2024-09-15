import electronStore from 'electron-store'
import { widgetKey } from '../shared/widgetKey'

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
  borderRadius: number
  alwaysOnTop: boolean
  transparentStatus: boolean
  enable: boolean
  html: string
}

export interface BtimeSettingStore extends windowSettings {
  currentCalender: 'Jalali' | 'Gregorian'
}
export interface NerkhYabSettingStore extends windowSettings {
  currencies: string[]
}

export interface ArzChandSettingStore extends windowSettings {
  currencies: string[]
}

export interface WeatherSettingStore extends windowSettings {
  city: {
    lat: number
    lon: number
    name: string
  }
}
export interface ClockSettingStore extends windowSettings {
  timeZone: {
    label: string
    value: string
  }
  showSecond: boolean
  showDate: boolean
  showTimeZone: boolean
}

export type Theme = 'system' | 'light' | 'dark'

export type StoreKey = {
  [widgetKey.BTime]: BtimeSettingStore
  [widgetKey.NerkhYab]: NerkhYabSettingStore
  [widgetKey.ArzChand]: ArzChandSettingStore
  [widgetKey.Weather]: WeatherSettingStore
  [widgetKey.Clock]: ClockSettingStore
  startup: boolean
  theme: Theme
  currenctVersion: string
}
export const store = new electronStore<StoreKey>({
  defaults: {
    BTime: {
      enable: true,
      bounds: {
        x: 0,
        y: 0,
        width: 180,
        height: 179,
        minHeight: 150,
        minWidth: 150,
      },
      currentCalender: 'Jalali',
      borderRadius: 28,
      alwaysOnTop: false,
      transparentStatus: false,
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
      borderRadius: 28,
      alwaysOnTop: false,
      transparentStatus: false,
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
        minHeight: 120,
        minWidth: 320,
        maxWidth: 410,
        maxHeight: 319,
      },
      borderRadius: 28,
      alwaysOnTop: false,
      transparentStatus: false,
      html: 'arzchand.html',
      currencies: ['usd', 'eur'],
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
      borderRadius: 28,
      alwaysOnTop: false,
      transparentStatus: false,
      city: null,
      html: 'weather.html',
    },
    Clock: {
      alwaysOnTop: false,
      borderRadius: 28,
      bounds: {
        width: 217,
        height: 180,
        x: 0,
        y: 0,
        minWidth: 150,
        minHeight: 76,
      },
      enable: false,
      timeZone: {
        label: 'آسیا / تهران',
        value: 'Asia/Tehran',
      },
      transparentStatus: false,
      showDate: true,
      showSecond: false,
      showTimeZone: false,
      html: 'clock.html',
    },
    startup: true,
    theme: 'system',
    currenctVersion: '1.2.0',
  },
  name: 'widgetify-app',
})
