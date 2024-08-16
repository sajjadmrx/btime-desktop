import electronStore from 'electron-store'

// type widgetKey = 'NerkhYab' | 'BTime'
export enum widgetKey {
  NerkhYab = 'NerkhYab',
  BTime = 'BTime',
}

interface windowSettings {
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

type StoreKey = {
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
        width: 170,
        height: 190,
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
        width: 240,
        height: 200,
      },
      alwaysOnTop: false,
      transparentStatus: false,
      theme: 'light',
    },
    startup: true,
  },
  name: 'bTime-app-v1',
})

console.log(store.path)
