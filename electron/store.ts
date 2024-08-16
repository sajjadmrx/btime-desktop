import electronStore from 'electron-store'

const BoundsKey = {
  NerkhYab: 'NerkhYab',
  BTime: 'BTime',
}
export interface StoreKey {
  bounds: Record<
    keyof typeof BoundsKey,
    { x: number; y: number; width: number; height: number }
  >
  alwaysOnTop: boolean
  transparentStatus: boolean
  startup: true
  theme: 'system' | 'light' | 'dark'
}

export const store = new electronStore<StoreKey>({
  defaults: {
    bounds: {
      NerkhYab: {
        x: 0,
        y: 0,
        height: 200,
        width: 240,
      },
      BTime: {
        x: 0,
        y: 0,
        height: 190,
        width: 170,
      },
    },

    alwaysOnTop: false,
    transparentStatus: false,
    startup: true,
    theme: 'light',
  },
  name: 'bTime.2',
})
