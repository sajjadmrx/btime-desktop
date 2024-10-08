/// <reference types="vite/client" />

import type { electronAPI, ipcPreload, storePreload } from '../electron/preload'

declare global {
	interface Window {
		store: typeof storePreload
		ipcMain: typeof ipcPreload
		electronAPI: typeof electronAPI
	}
}
