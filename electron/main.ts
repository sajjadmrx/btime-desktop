import { release } from 'node:os'
import { join } from 'node:path'
import { config } from 'dotenv'
import {
	BrowserWindow,
	Menu,
	Tray,
	app,
	nativeImage,
	nativeTheme,
	shell,
} from 'electron'
import isDev from 'electron-is-dev'
import { getIconPath, getPublicFilePath } from '../shared/getIconPath'
import { widgetKey } from '../shared/widgetKey'
import { initIpcMain } from './ipc-main'
import { store } from './store'
import { update } from './update'
import { toggleStartUp } from './utils/startup.util'
import { createSettingWindow, createWindow } from './window'

config()
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, './dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
	? join(process.env.DIST_ELECTRON, './public')
	: process.env.DIST

let mainWin: BrowserWindow | null
const icon = nativeImage.createFromPath(getIconPath())
global.VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

initIpcMain()
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
	app.quit()
	process.exit(0)
}

if (isDev) {
	Object.defineProperty(app, 'isPackaged', {
		get() {
			return true
		},
	})
}

const isWindoAndDrawin: boolean = ['darwin', 'win32'].includes(process.platform)
if (isWindoAndDrawin) {
	toggleStartUp(app, store.get('main').startup)
}

async function onAppReady() {
	const nerkhStore = store.get(widgetKey.NerkhYab)
	const btimeStore = store.get(widgetKey.BTime)
	const arzChandStore = store.get(widgetKey.ArzChand)
	const weatherStore = store.get(widgetKey.Weather)
	const clockStore = store.get(widgetKey.Clock)
	const damDasti = store.get(widgetKey.DamDasti)
	const moveable = store.get('main').moveable
	// Btime widget
	if (btimeStore.enable) {
		const btime = await createWindow({
			height: btimeStore.bounds.height,
			minHeight: btimeStore.bounds.minHeight || 150,
			minWidth: btimeStore.bounds.minWidth || 150,
			maxHeight: btimeStore.bounds.maxHeight,
			maxWidth: btimeStore.bounds.maxWidth,
			width: btimeStore.bounds.width,
			x: btimeStore.bounds.x,
			y: btimeStore.bounds.y,
			title: widgetKey.BTime,
			html: btimeStore.html || 'time.html',
			devTools: true,
			alwaysOnTop: btimeStore.alwaysOnTop,
			reziable: true,
			moveable,
			saveBounds: true,
		})
		mainWin = btime
	}

	// NerkhYab widget
	if (nerkhStore.enable) {
		const nerkhWindow = await createWindow({
			height: nerkhStore.bounds.height,
			minHeight: nerkhStore.bounds.minHeight || 120,
			minWidth: nerkhStore.bounds.minWidth || 226,
			maxWidth: nerkhStore.bounds.maxWidth,
			maxHeight: nerkhStore.bounds.maxHeight,
			width: nerkhStore.bounds.width,
			x: nerkhStore.bounds.x,
			y: nerkhStore.bounds.y,
			title: widgetKey.NerkhYab,
			html: nerkhStore.html || 'rate.html',
			devTools: true,
			alwaysOnTop: nerkhStore.alwaysOnTop,
			reziable: true,
			moveable,
			saveBounds: true,
		})

		if (!mainWin) {
			mainWin = nerkhWindow
		}
	}

	// ArzChand widget
	if (arzChandStore.enable) {
		const arzChandWindow = await createWindow({
			height: arzChandStore.bounds.height,

			minHeight: arzChandStore.bounds.minHeight || 120,
			minWidth: arzChandStore.bounds.minWidth || 320,
			maxWidth: arzChandStore.bounds.maxWidth || 410,
			maxHeight: arzChandStore.bounds.maxHeight || 319,
			moveable,
			width: arzChandStore.bounds.width,
			x: arzChandStore.bounds.x,
			y: arzChandStore.bounds.y,
			title: widgetKey.ArzChand,
			html: arzChandStore.html || 'arzchand.html',
			devTools: true,
			alwaysOnTop: arzChandStore.alwaysOnTop,
			reziable: true,
			saveBounds: true,
		})

		if (!mainWin) {
			mainWin = arzChandWindow
		}
	}

	// Weather widget
	if (weatherStore.enable) {
		const weatherWindow = await createWindow({
			height: weatherStore.bounds.height,
			minWidth: weatherStore.bounds.minWidth || 183,
			minHeight: weatherStore.bounds.minHeight || 203,
			maxWidth: weatherStore.bounds.maxWidth,
			maxHeight: weatherStore.bounds.maxHeight,
			width: weatherStore.bounds.width,
			x: weatherStore.bounds.x,
			y: weatherStore.bounds.y,
			title: widgetKey.Weather,
			html: weatherStore.html || 'weather.html',
			devTools: true,
			alwaysOnTop: weatherStore.alwaysOnTop,
			reziable: true,
			saveBounds: true,
			moveable,
		})

		if (!mainWin) {
			mainWin = weatherWindow
		}
	}

	if (clockStore.enable) {
		const clockWindow = await createWindow({
			height: clockStore.bounds.height,
			width: clockStore.bounds.width,
			minHeight: clockStore.bounds.minHeight,
			minWidth: clockStore.bounds.minWidth,
			maxHeight: clockStore.bounds.maxHeight,
			maxWidth: clockStore.bounds.maxWidth,
			x: clockStore.bounds.x,
			y: clockStore.bounds.y,
			title: widgetKey.Clock,
			html: clockStore.html || 'clock.html',
			devTools: true,
			alwaysOnTop: clockStore.alwaysOnTop,
			reziable: true,
			saveBounds: true,
			moveable,
		})

		if (!mainWin) {
			mainWin = clockWindow
		}
	}

	if (damDasti.enable) {
		await createWindow({
			height: clockStore.bounds.height,
			width: clockStore.bounds.width,
			minHeight: clockStore.bounds.minHeight,
			minWidth: clockStore.bounds.minWidth,
			maxHeight: 1000,
			maxWidth: 1000,
			x: clockStore.bounds.x,
			y: clockStore.bounds.y,
			title: widgetKey.DamDasti,
			html: damDasti.html,
			devTools: true,
			alwaysOnTop: damDasti.alwaysOnTop,
			reziable: true,
			saveBounds: false,
			moveable,
		})
	}
	if (!mainWin) {
		mainWin = await createSettingWindow()
	}

	const appVersion = app.getVersion()
	if (store.get('currentVersion') !== appVersion) {
		store.set('currentVersion', appVersion)
		const settingPage = await createSettingWindow()
		settingPage.once('ready-to-show', async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000))
			settingPage.webContents.send('update-details', { hello: 'world' })
		})
	}

	nativeTheme.themeSource = store.get('main').theme
	createTray()
	update(mainWin, app)
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
		mainWin = null
	}
})

app.on('second-instance', () => {
	if (mainWin) {
		if (mainWin.isMinimized()) mainWin.restore()
		mainWin.focus()
	}
})

app.on('activate', () => {
	const allWindows = BrowserWindow.getAllWindows()
	if (allWindows.length) {
		allWindows[0].focus()
	} else {
		app.quit()
	}
})

app.whenReady().then(onAppReady)

function getIcon(name: string) {
	return nativeImage.createFromPath(getPublicFilePath(name))
}

let createdTray: Tray | null = null
function createTray() {
	if (createdTray) createdTray.destroy()

	const appIcon = new Tray(icon)

	const contextMenu = getContextMenu()

	appIcon.on('double-click', () => {
		createSettingWindow()
	})

	appIcon.setToolTip('Widgetify')

	appIcon.setContextMenu(contextMenu)
	createdTray = appIcon
	return appIcon
}

function getContextMenu() {
	const contextMenu = Menu.buildFromTemplate([
		{
			label: `Widgetify(B Time) | ${app.getVersion()}`,
			enabled: false,
			icon: icon.resize({ height: 19, width: 19 }),
		},
		{
			label: 'Settings',
			icon: getIcon('icons/setting.png').resize({ height: 19, width: 19 }),
			click: async () => {
				let settingWin = BrowserWindow.getAllWindows().find(
					(win) => win.getTitle() === 'Setting',
				)
				if (settingWin) {
					settingWin.show()
				} else {
					settingWin = await createSettingWindow()
				}
			},
		},

		{
			label: 'Open at boot',
			icon: store.get('main').startup && getIcon('icons/checked.png'),
			visible: isWindoAndDrawin,
			click: () => {
				const startupStatus = store.get('main').startup
				const newValue = !startupStatus
				store.set('main.startup', newValue)
				toggleStartUp(app, newValue)
				contextMenu.closePopup()
				createTray()
			},
		},
		{
			label: 'Website',
			icon: getIcon('icons/link.png').resize({ height: 19, width: 19 }),
			click: () => {
				shell.openExternal('https://github.com/sajjadmrx/btime-desktop')
			},
		},
		{
			label: 'Restart',
			icon: getIcon('icons/restart.png'),
			click: () => {
				app.relaunch()
				app.exit(0)
			},
		},
		{
			label: 'Quit bTime',
			icon: getIcon('icons/power.png'),
			click: () => {
				app.exit(1)
			},
		},
	])

	return contextMenu
}
