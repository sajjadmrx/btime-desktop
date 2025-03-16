import fs from 'fs'
import path from 'path'
import {
	BrowserWindow,
	app,
	dialog,
	ipcMain,
	nativeTheme,
	shell,
} from 'electron'
import { userLogger } from '../shared/logger'
import { widgetKey } from '../shared/widgetKey'
import { type MainSettingStore, store, type windowSettings } from './store'
import { createSettingWindow, createWindow } from './window'

export function initIpcMain() {
	ipcMain.on('reOpen', () => {
		app.relaunch()
		app.exit()
	})

	ipcMain.on('changeTheme', (event, theme: MainSettingStore['theme']) => {
		nativeTheme.themeSource = theme
	})

	ipcMain.on('openSettingWindow', () => {
		createSettingWindow()
	})

	ipcMain.on('open-url', (event, url: string) => {
		shell.openExternal(url)
	})

	ipcMain.on('toggle-transparent', (event, windowKey: string) => {
		const win = BrowserWindow.getAllWindows().filter(
			(win) => win.title === windowKey,
		)[0]
		if (win) {
			win.webContents.send('transparent_status', {
				enableTransparent: (
					store.get(widgetKey[windowKey]) as unknown as windowSettings
				).transparentStatus,
			})
		}
	})

	ipcMain.on('toggle-isBackgroundDisabled', (event, windowKey: string) => {
		const win = BrowserWindow.getAllWindows().filter(
			(win) => win.title === windowKey,
		)[0]
		if (win) {
			const isBackgroundDisabled = (
				store.get(widgetKey[windowKey]) as unknown as windowSettings
			).isBackgroundDisabled

			win.webContents.send('background_status', {
				isBackgroundDisabled: isBackgroundDisabled,
			})
		}
	})

	ipcMain.handle('getBorderRadius', async (event, window: string) => {
		try {
			const win = BrowserWindow.getAllWindows().filter(
				(win) => win.title === window,
			)[0]
			const borderRadius = await win.webContents.executeJavaScript(`
 getComputedStyle(document.querySelector('.h-screen')).borderRadius
  `)

			return borderRadius
		} catch (error) {
			userLogger.error(`Error in getBorderRadius: ${error}`)
			return ''
		}
	})

	ipcMain.handle(
		'setBorderRadius',
		async (event, window: string, value: string) => {
			const win = BrowserWindow.getAllWindows().filter(
				(win) => win.title === window,
			)[0]

			await win.webContents.executeJavaScript(
				`
        document.querySelector('.h-screen').style.borderRadius = '${value}'
        `,
				true,
			)
		},
	)

	ipcMain.on('updated-setting', async (event, windowKey: string) => {
		const win = BrowserWindow.getAllWindows().filter(
			(win) => win.title === windowKey,
		)[0]
		if (win) {
			win.webContents.send('updated-setting')
		}
	})

	ipcMain.on('toggle-enable', async (event, windowKey: string) => {
		userLogger.info(`Toggle enable for ${windowKey}`)
		const win = BrowserWindow.getAllWindows().filter(
			(win) => win.title === windowKey,
		)[0]
		const setting = store.get(widgetKey[windowKey]) as unknown as windowSettings
		const moveable = store.get('main').moveable
		if (!setting) {
			userLogger.error(`Setting not found for ${windowKey}`)
			return
		}
		if (!setting.enable) {
			if (win) {
				try {
					userLogger.info(`Attempting to close ${windowKey}`)
					win.destroy()
					userLogger.info(`Successfully closed ${windowKey}`)
				} catch (error) {
					userLogger.error(`Failed to close ${windowKey}: ${error}`)
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
			} else {
				userLogger.error(`Window not found for ${windowKey}`)
			}
		} else {
			await createWindow({
				height: setting.bounds.height,
				width: setting.bounds.width,
				minHeight: setting.bounds.minHeight,
				minWidth: setting.bounds.minWidth,
				maxHeight: setting.bounds.maxHeight,
				maxWidth: setting.bounds.maxWidth,
				x: setting.bounds.x,
				y: setting.bounds.y,
				title: windowKey,
				html: setting.html,
				devTools: true,
				alwaysOnTop: setting.alwaysOnTop,
				reziable: true,
				saveBounds: true,
				moveable,
			})
			userLogger.info(`Widget ${windowKey} enabled`)
		}
	})

	ipcMain.on('reset-setting', async (event) => {
		const mainSetting = store.get('main')

		store.clear()

		const newMainSetting = store.get('main')

		store.set('main', {
			...newMainSetting,
			currentVersion: mainSetting.currentVersion,
			userId: mainSetting.userId,
		} as MainSettingStore)

		app.relaunch()
		app.exit()
	})

	// App launcher functionality
	ipcMain.handle('select-app', async () => {
		try {
			const { canceled, filePaths } = await dialog.showOpenDialog({
				properties: ['openFile'],
				filters: [
					{ name: 'Applications', extensions: ['exe', 'lnk', 'app', 'msi'] },
				],
			})

			if (canceled || filePaths.length === 0) return null

			const filePath = filePaths[0]
			const name = path.basename(filePath, path.extname(filePath))

			// You could integrate with node-file-icon-extractor or similar library
			// to extract app icons, but for simplicity returning just name and path
			return {
				name,
				path: filePath,
				icon: null,
			}
		} catch (error) {
			userLogger.error(`Error selecting app: ${error}`)
			return null
		}
	})

	ipcMain.handle('launch-app', async (_event, appPath) => {
		try {
			userLogger.info(`Launching app: ${appPath}`)
			return shell.openPath(appPath)
		} catch (error) {
			userLogger.error(`Error launching app: ${error}`)
			return { error: error.message }
		}
	})

	ipcMain.handle('get-app-info', async (_event, filePath) => {
		try {
			// Validate file exists
			if (!fs.existsSync(filePath)) {
				return null
			}

			const name = path.basename(filePath, path.extname(filePath))

			// Here you could add icon extraction logic
			return {
				name,
				icon: null,
			}
		} catch (error) {
			userLogger.error(`Error getting app info: ${error}`)
			return null
		}
	})

	ipcMain.handle('get-apps', async () => {
		try {
			if (!store.has('appLauncher.apps')) {
				return []
			}
			return store.get('appLauncher.apps')
		} catch (error) {
			userLogger.error(`Error getting saved apps: ${error}`)
			return []
		}
	})

	ipcMain.handle('save-apps', async (_event, apps) => {
		try {
			store.set('appLauncher.apps', apps)
			return true
		} catch (error) {
			userLogger.error(`Error saving apps: ${error}`)
			return false
		}
	})
}
