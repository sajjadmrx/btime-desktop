import os from 'node:os'
import path from 'node:path'
import { BrowserWindow, screen } from 'electron'
import ms from 'ms'
import { getIconPath } from '../shared/getIconPath'
import { userLogger } from '../shared/logger'
import { widgetKey } from '../shared/widgetKey'
import { store, type windowSettings } from './store'

export interface Window {
	height: number
	minHeight: number
	width: number
	moveable: boolean
	minWidth: number
	maxWidth?: number
	maxHeight?: number
	x: number
	y: number
	title: string
	html: string
	devTools: boolean
	alwaysOnTop: boolean
	reziable: boolean
	saveBounds: boolean
	closable?: boolean
}
export async function createWindow(payload: Window) {
	const isValidate = isPointWithinDisplay(payload.x, payload.y)
	if (!isValidate) {
		userLogger.error(
			'Invalid point for window',
			payload.title,
			payload.x,
			payload.y,
		)
		const displays = screen.getAllDisplays()
		const { x, y } = displays[0].workArea
		payload.x = x
		payload.y = y
	}

	const win = new BrowserWindow({
		icon: getIconPath(),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			devTools: payload.devTools,
			nodeIntegration: true,
			contextIsolation: true,
		},
		height: payload.height,
		width: payload.width,
		minHeight: payload.minHeight,
		minWidth: payload.minWidth,
		maxWidth: payload.maxWidth,
		maxHeight: payload.maxHeight,
		frame: false,
		transparent: true,
		resizable: payload.reziable,
		alwaysOnTop: payload.alwaysOnTop,
		skipTaskbar: true,
		fullscreenable: false,
		movable: payload.moveable,
		maximizable: false,
		minimizable: false,
		closable: payload.closable,
		center: true,
		x: payload.x || undefined,
		y: payload.y || undefined,
		title: payload.title,
		titleBarStyle: 'hidden',
	})

	if (os.platform() === 'darwin') win.setWindowButtonVisibility(false)

	win.webContents.on('did-finish-load', () => {
		const setting: windowSettings = store.get(
			widgetKey[payload.title],
		) as unknown as windowSettings

		win.webContents.send('transparent_status', {
			enableTransparent: setting.transparentStatus,
		})

		win.webContents.send('background_status', {
			isBackgroundDisabled: setting.isBackgroundDisabled,
		})

		const borderRadius = setting.borderRadius

		win.webContents.send('border-radius', {
			radius: borderRadius ? `${borderRadius}px` : '28px',
		})
	})

	if (global.VITE_DEV_SERVER_URL) {
		win.loadURL(`${global.VITE_DEV_SERVER_URL}/html/${payload.html}`)
	} else {
		win.loadFile(path.join(process.env.DIST, '/html', payload.html))
	}

	if (payload.saveBounds) {
		onClose(win)
		onMoved(win)
	}

	return win
}

export function isPointWithinDisplay(x: number, y: number) {
	const allDisplays = screen.getAllDisplays()
	let isValidate = false

	for (const display of allDisplays) {
		const { x: dx, y: dy, width, height } = display.workArea
		if (x >= dx && x < dx + width && y >= dy && y < dy + height) {
			isValidate = true
			break
		}
	}

	return isValidate
}

export function onMoved(win: BrowserWindow) {
	win.on('moved', () => {
		if (win) {
			let { x, y } = win.getBounds()
			const displays = screen.getAllDisplays()

			const currentDisplay =
				displays.find((display) => {
					const { x: dx, y: dy, width, height } = display.workArea
					return x >= dx && x < dx + width && y >= dy && y < dy + height
				}) || screen.getPrimaryDisplay()

			const { width, height } = currentDisplay.workArea

			if (x < currentDisplay.workArea.x) {
				x = currentDisplay.workArea.x
			} else if (
				x + win.getBounds().width >
				currentDisplay.workArea.x + width
			) {
				x = currentDisplay.workArea.x + width - win.getBounds().width
			}

			if (y < currentDisplay.workArea.y) {
				y = currentDisplay.workArea.y
			} else if (
				y + win.getBounds().height >
				currentDisplay.workArea.y + height
			) {
				y = currentDisplay.workArea.y + height - win.getBounds().height
			}

			win.setBounds({
				x,
				y,
				width: win.getBounds().width,
				height: win.getBounds().height,
			})
		}
	})
}

function onClose(win: BrowserWindow) {
	const saveWindowBounds = () => {
		if (!win.isDestroyed()) {
			const key = win.getTitle()

			try {
				const currentSettings = store.get(
					widgetKey[key],
				) as unknown as windowSettings

				const { x, y, width, height } = win.getBounds()

				console.log(
					'Saving window bounds on close for:',
					widgetKey[key],
					x,
					y,
					width,
					height,
				)
				store.set(widgetKey[key], {
					...currentSettings,
					bounds: {
						...currentSettings.bounds,
						x,
						y,
						width,
						height,
					},
				})
			} catch (error) {
				console.error(`Error saving window bounds for ${key}:`, error)
			}
		} else {
			console.error('Window is destroyed')
		}
	}
	win.on('close', saveWindowBounds)
	win.on('blur', saveWindowBounds)
}

export async function createSettingWindow() {
	const isExist = BrowserWindow.getAllWindows().find(
		(win) => win.getTitle() === 'Setting',
	)
	if (isExist) {
		isExist.show()
		return isExist
	}

	return await createWindow({
		height: 432,
		width: 595,
		minHeight: 432,
		minWidth: 595,
		moveable: true,
		x: 0,
		y: 0,
		title: 'Setting',
		html: 'setting.html',
		devTools: true,
		alwaysOnTop: true,
		reziable: false,
		saveBounds: false,
		closable: true,
	})
}
