import electronStore from 'electron-store'

// type widgetKey = 'NerkhYab' | 'BTime'
export enum widgetKey {
  NerkhYab = 'NerkhYab',
  BTime = 'BTime',
  ArzChand = 'ArzChand',
}

export interface windowSettings {
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
  alwaysOnTop: boolean
  transparentStatus: boolean
  enable: boolean
}

export interface BtimeSettingStore extends windowSettings {}
export interface NerkhYabSettingStore extends windowSettings {
  currencies: string[]
}

export interface ArzChandSettingStore extends windowSettings {
  currencies: string[]
}

export type Theme = 'system' | 'light' | 'dark'

export type StoreKey = {
  [widgetKey.BTime]: BtimeSettingStore
  [widgetKey.NerkhYab]: NerkhYabSettingStore
  [widgetKey.ArzChand]: ArzChandSettingStore
  startup: boolean
  theme: Theme
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
      },
      alwaysOnTop: false,
      transparentStatus: false,
    },
    NerkhYab: {
      enable: true,
      bounds: {
        x: 0,
        y: 0,
        width: 226,
        height: 134,
      },
      alwaysOnTop: false,
      transparentStatus: false,
      currencies: ['usd'],
    },
    ArzChand: {
      enable: false,
      bounds: {
        x: 0,
        y: 0,
        width: 226,
        height: 134,
      },
      alwaysOnTop: false,
      transparentStatus: false,
      currencies: ['usd', 'eur'],
    },
    startup: true,
    theme: 'system',
  },
  name: 'bTime-app-v1',
})
