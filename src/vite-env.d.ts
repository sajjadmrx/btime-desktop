/// <reference types="vite/client" />

import { ipcPreload, storePreload } from '../electron/preload'

declare global {
  interface Window {
    store: typeof storePreload
    ipcMain: typeof ipcPreload
  }
}
