import os from 'node:os'
import path from 'node:path'
import { BrowserWindow, screen } from 'electron'
import { store } from './store'

let parentWindow: BrowserWindow | null = null
const childWindows: BrowserWindow[] = []

let lastParentBounds = { x: 0, y: 0, width: 0, height: 0 }

const PARENT_WINDOW_KEY = 'parentWindow'

export function createParentWindow(): BrowserWindow {
	if (parentWindow && !parentWindow.isDestroyed()) {
		return parentWindow
	}

	// Get display dimensions
	const primaryDisplay = screen.getPrimaryDisplay()
	const { width, height } = primaryDisplay.workArea

	let savedBounds = {
		width: Math.round(width * 0.6), // 60% of screen width
		height: Math.round(height * 0.6), // 60% of screen height
		x: Math.round(width * 0.2),
		y: Math.round(height * 0.2),
	}

	try {
		// @ts-ignore
		const storedBounds = store.get(PARENT_WINDOW_KEY)?.bounds
		if (storedBounds) {
			const allDisplays = screen.getAllDisplays()
			const isOnScreen = allDisplays.some((display) => {
				const { x, y, width: dWidth, height: dHeight } = display.workArea
				return (
					storedBounds.x >= x &&
					storedBounds.y >= y &&
					storedBounds.x + storedBounds.width <= x + dWidth &&
					storedBounds.y + storedBounds.height <= y + dHeight
				)
			})

			if (isOnScreen) {
				savedBounds = storedBounds
			}
		}
	} catch (err) {
		console.error('Failed to load saved parent window bounds:', err)
	}

	const win = new BrowserWindow({
		width: savedBounds.width,
		height: savedBounds.height,
		x: savedBounds.x,
		y: savedBounds.y,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			contextIsolation: true,
		},
		frame: false,
		transparent: true,
		resizable: true,
		movable: true,
		title: 'Widgetify Parent',
		titleBarStyle: 'hidden',

		autoHideMenuBar: true,
	})

	if (os.platform() === 'darwin') win.setWindowButtonVisibility(false)

	if (global.VITE_DEV_SERVER_URL) {
		win.loadURL(`${global.VITE_DEV_SERVER_URL}/html/parent.html`)
	} else {
		win.loadFile(path.join(process.env.DIST, '/html/parent.html'))
	}

	lastParentBounds = win.getBounds()

	win.on('move', () => {
		repositionChildWindows()
		saveParentWindowBounds()
	})

	win.on('resize', () => {
		constrainChildWindows()
		saveParentWindowBounds()
	})

	win.on('close', () => {
		saveParentWindowBounds()

		for (const child of childWindows) {
			if (!child.isDestroyed()) {
				child.close()
			}
		}
	})

	win.on('blur', saveParentWindowBounds)

	parentWindow = win
	return win
}

function saveParentWindowBounds() {
	if (!parentWindow || parentWindow.isDestroyed()) return

	try {
		const bounds = parentWindow.getBounds()
		console.log('Saving parent window bounds:', bounds)

		// Save to store using the parent window key
		store.set(PARENT_WINDOW_KEY, {
			bounds,
		})
	} catch (err) {
		console.error('Failed to save parent window bounds:', err)
	}
}

export function addChildWindow(childWindow: BrowserWindow) {
	if (!childWindows.includes(childWindow)) {
		childWindows.push(childWindow)

		childWindow.setParentWindow(parentWindow)

		constrainWindowToParent(childWindow)

		childWindow.on('move', () => {
			constrainWindowToParent(childWindow)
		})
	}
	return childWindow
}

function repositionChildWindows() {
	if (!parentWindow || parentWindow.isDestroyed()) return

	const currentBounds = parentWindow.getBounds()

	const deltaX = currentBounds.x - lastParentBounds.x
	const deltaY = currentBounds.y - lastParentBounds.y

	if (deltaX !== 0 || deltaY !== 0) {
		console.log(`Parent moved by delta: (${deltaX}, ${deltaY})`)

		for (const child of childWindows) {
			if (!child.isDestroyed()) {
				const childBounds = child.getBounds()
				child.setBounds({
					x: childBounds.x + deltaX,
					y: childBounds.y + deltaY,
					width: childBounds.width,
					height: childBounds.height,
				})
			}
		}

		lastParentBounds = { ...currentBounds }
	}
}

function constrainChildWindows() {
	for (const child of childWindows) {
		if (!child.isDestroyed()) {
			constrainWindowToParent(child)
		}
	}
}

function constrainWindowToParent(childWindow: BrowserWindow) {
	if (!parentWindow || parentWindow.isDestroyed() || childWindow.isDestroyed())
		return

	const parentBounds = parentWindow.getBounds()
	const childBounds = childWindow.getBounds()

	const contentBounds = parentWindow.getContentBounds()
	const frameWidth = parentBounds.width - contentBounds.width
	const frameHeight = parentBounds.height - contentBounds.height
	const titleBarHeight = frameHeight - 10

	const availableArea = {
		x: parentBounds.x,
		y: parentBounds.y + titleBarHeight,
		width: parentBounds.width - frameWidth,
		height: parentBounds.height - frameHeight,
	}

	let newX = childBounds.x
	let newY = childBounds.y

	if (newX < availableArea.x) {
		newX = availableArea.x
	} else if (newX + childBounds.width > availableArea.x + availableArea.width) {
		newX = availableArea.x + availableArea.width - childBounds.width
	}

	if (newY < availableArea.y) {
		newY = availableArea.y
	} else if (
		newY + childBounds.height >
		availableArea.y + availableArea.height
	) {
		newY = availableArea.y + availableArea.height - childBounds.height
	}

	if (newX !== childBounds.x || newY !== childBounds.y) {
		childWindow.setBounds({
			x: newX,
			y: newY,
			width: childBounds.width,
			height: childBounds.height,
		})
	}
}
