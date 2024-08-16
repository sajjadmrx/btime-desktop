import electronStore from 'electron-store'

// type widgetKey = 'NerkhYab' | 'BTime'
export enum widgetKey {
  NerkhYab = 'NerkhYab',
  BTime = 'BTime',
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
  theme: 'system' | 'light' | 'dark'
  enable: boolean
}

export type StoreKey = {
  [widgetKey.BTime]: windowSettings
  [widgetKey.NerkhYab]: windowSettings & {
    currencies: string[]
  }
  startup: boolean
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
      theme: 'light',
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
      theme: 'light',
      currencies: ['usd'],
    },
    startup: true,
  },
  name: 'bTime-app-v1',
})
