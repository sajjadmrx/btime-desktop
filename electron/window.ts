import { BrowserWindow, screen } from 'electron'
import { widgetKey } from '../shared/widgetKey'
import { store } from './store'
import { getIconPath } from '../shared/getIconPath'
import os from 'node:os'
import path from 'node:path'

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
}
export async function createWindow(payload: Window) {
	//validate x and y
	const isValdiate = isPointWithinDisplay(payload.x, payload.y)
	if (!isValdiate) {
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
		center: true,
		x: payload.x || undefined,
		y: payload.y || undefined,
		title: payload.title,
		titleBarStyle: 'hidden',
	})

	if (os.platform() === 'darwin') win.setWindowButtonVisibility(false)
	win.webContents.on('did-finish-load', () => {
		win.webContents.send('transparent_status', {
			newStatus: store.get(widgetKey[payload.title]).transparentStatus,
		})

		const borderRadius = store.get(widgetKey[payload.title]).borderRadius

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
		onMoved(win)
		onResized(win)
	}

	return win
}

export function isPointWithinDisplay(x: number, y: number) {
	const allDisplays = screen.getAllDisplays()
	let isValdiate = false

	for (const display of allDisplays) {
		const { x: dx, y: dy, width, height } = display.workArea
		if (x >= dx && x < dx + width && y >= dy && y < dy + height) {
			isValdiate = true
			break
		}
	}

	return isValdiate
}

export function onMoved(win: BrowserWindow) {
	win.on('moved', () => {
		if (win) {
			let { x, y } = win.getBounds()
			const displays = screen.getAllDisplays()

			// Find the display the window is currently on
			const currentDisplay =
				displays.find((display) => {
					const { x: dx, y: dy, width, height } = display.workArea
					return x >= dx && x < dx + width && y >= dy && y < dy + height
				}) || screen.getPrimaryDisplay()

			const { width, height } = currentDisplay.workArea

			// Check if the window is out of bounds and adjust the position
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

			// Set the new bounds if adjustments were made
			win.setBounds({
				x,
				y,
				width: win.getBounds().width,
				height: win.getBounds().height,
			})

			// Save the new position
			const key = win.getTitle()

			store.set(widgetKey[key], {
				...store.get(widgetKey[key]),
				bounds: {
					...store.get(widgetKey[key]).bounds,
					x: win.getBounds().x,
					y: win.getBounds().y,
					width: win.getBounds().width,
					height: win.getBounds().height,
				},
			})
		}
	})
}
export function onResized(win: BrowserWindow) {
	win.on('resize', () => {
		if (win) {
			const { width, height } = win.getBounds()
			const key = win.getTitle()

			console.log(`Saving ${key} bounds: ${width}x${height}`)
			store.set(widgetKey[key], {
				...store.get(widgetKey[key]),
				bounds: {
					...store.get(widgetKey[key]).bounds,
					x: win.getBounds().x,
					y: win.getBounds().y,
					width: win.getBounds().width,
					height: win.getBounds().height,
				},
			})
		}
	})
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
	})
}
