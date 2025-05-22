import path from 'node:path'
import { promisify } from 'node:util'
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
import { addChildWindow } from './parentWindow'
import {
	type BtimeSettingStore,
	type MainSettingStore,
	store,
	type windowSettings,
} from './store'
import { BtimeConfig } from './widgets/btime-config'
import { createSettingWindow, createWindow } from './window'

const windowsShortcuts = require('windows-shortcuts')
const resolveShortcut = promisify(windowsShortcuts.query)

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
			if (!win) {
				userLogger.log(`can't find ${window}`)
				return
			}
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
			const setting = store.get(
				widgetKey[windowKey],
			) as unknown as windowSettings
			if (windowKey === widgetKey.BTime) {
				const bTimeSetting = setting as unknown as BtimeSettingStore
				if (bTimeSetting.showCalendar) {
					win.setSize(BtimeConfig.minWidth, BtimeConfig.minHeight)
					win.setResizable(false)
				} else {
					win.setResizable(true)
					win.setSize(setting.bounds.width, setting.bounds.height)
				}
			}

			win.webContents.send('updated-setting')
		}
	})

	ipcMain.on('toggle-enable', async (event, windowKey: string) => {
		const mainSetting = await store.get('main')

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
			const win = await createWindow({
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

			if (mainSetting.useParentWindowMode) {
				addChildWindow(win)
			}

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

	ipcMain.handle('open-file-dialog', async () => {
		const filters = []

		if (process.platform === 'win32') {
			filters.push({
				name: 'Executable Files',
				extensions: ['exe', 'bat', 'cmd'],
			})
		} else if (process.platform === 'darwin') {
			filters.push({ name: 'Applications', extensions: ['app'] })
		} else if (process.platform === 'linux') {
			filters.push({
				name: 'Applications',
				extensions: ['AppImage', 'sh', 'run', 'bin'],
			})
		}

		filters.push({ name: 'All Files', extensions: ['*'] })

		return dialog.showOpenDialog({
			properties: ['openFile'],
			filters: filters,
			title: 'انتخاب برنامه',
		})
	})

	ipcMain.handle('launch-app', async (_event, appPath) => {
		try {
			return shell.openPath(appPath)
		} catch (error) {
			userLogger.error(`Error launching app: ${error}`)
			return { error: error.message }
		}
	})

	ipcMain.handle('get-app-info', async (_event, filePath: string) => {
		try {
			let actualPath = filePath
			let shortcutTarget = null

			if (filePath.toLowerCase().endsWith('.lnk')) {
				try {
					const shortcutInfo = await resolveShortcut(filePath)
					if (shortcutInfo?.target) {
						shortcutTarget = shortcutInfo.target
						actualPath = shortcutInfo.target
						userLogger.info(`Shortcut resolved to: ${actualPath}`)
					}
				} catch (shortcutError) {
					userLogger.error(`Error resolving shortcut: ${shortcutError}`)
				}
			}

			const icon = await app.getFileIcon(actualPath, { size: 'large' })
			const iconDataUrl = icon.toDataURL()

			const name = shortcutTarget
				? path.basename(shortcutTarget, path.extname(shortcutTarget))
				: path.basename(filePath, path.extname(filePath))

			const appInfo = {
				name: name,
				path: filePath,
				icon: iconDataUrl,
				actualPath: actualPath,
			}

			return appInfo
		} catch (error) {
			return {
				name: path.basename(filePath, path.extname(filePath)),
				path: filePath,
				icon: null,
			}
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
