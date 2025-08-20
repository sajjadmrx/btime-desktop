import type { BrowserWindow } from 'electron'
import { userLogger } from '../../shared/logger'

export function forceCloseWin(win: BrowserWindow) {
	const title = win.getTitle()
	try {
		userLogger.info(`Attempting to close ${title}`)
		win.destroy()
		userLogger.info(`Successfully closed ${title}`)
	} catch (error) {
		userLogger.error(`Failed to close ${title}: ${error}`)
		if (!win.isDestroyed()) {
			win.webContents.closeDevTools()
			win.hide()
			setImmediate(() => {
				if (!win.isDestroyed()) {
					win.close()
				}
			})
		}
	}
}
