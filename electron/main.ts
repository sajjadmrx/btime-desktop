import {
  app,
  BrowserWindow,
  Menu,
  nativeImage,
  shell,
  Tray,
  nativeTheme,
  screen,
} from 'electron'
import path from 'node:path'
import { store } from './store'
import { join } from 'node:path'
import { config } from 'dotenv'
import { getIconPath, getPublicFilePath } from '../shared/getIconPath'
import os from 'os'
import { update } from './update'
import isDev from 'electron-is-dev'
import { release } from 'node:os'
import { toggleStartUp } from './utils/startup.util'
import { initIpcMain } from './ipc-main'
import { widgetKey } from '../shared/widgetKey'

config()
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, './dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, './public')
  : process.env.DIST

let mainWin: BrowserWindow | null
const icon = nativeImage.createFromPath(getIconPath())
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
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
  toggleStartUp(app, store.get('startup'))
}

async function onAppReady() {
  const nerkhStore = store.get(widgetKey.NerkhYab)
  const btimeStore = store.get(widgetKey.BTime)
  const arzChandStore = store.get(widgetKey.ArzChand)
  const weatherStore = store.get(widgetKey.Weather)

  // Btime widget
  if (btimeStore.enable) {
    const btime = await createWindow({
      height: btimeStore.bounds.height,
      minHeight: 150,
      minWidth: 150,
      width: btimeStore.bounds.width,
      x: btimeStore.bounds.x,
      y: btimeStore.bounds.y,
      title: widgetKey.BTime,
      html: 'index.html',
      devTools: true,
      alwaysOnTop: btimeStore.alwaysOnTop,
      reziable: true,
    })
    mainWin = btime
    onMoved(btime)
    onResized(btime)
  }

  // NerkhYab widget
  if (nerkhStore.enable) {
    const nerkhWindow = await createWindow({
      height: nerkhStore.bounds.height,
      minHeight: 120,
      minWidth: 226,
      width: nerkhStore.bounds.width,
      x: nerkhStore.bounds.x,
      y: nerkhStore.bounds.y,
      title: widgetKey.NerkhYab,
      html: 'rate.html',
      devTools: true,
      alwaysOnTop: nerkhStore.alwaysOnTop,
      reziable: true,
    })
    onMoved(nerkhWindow)
    onResized(nerkhWindow)
    if (!mainWin) {
      mainWin = nerkhWindow
    }
  }

  // ArzChand widget
  if (arzChandStore.enable) {
    const arzChandWindow = await createWindow({
      height: arzChandStore.bounds.height,
      minHeight: 210,
      minWidth: 320,
      maxWidth: 410,
      maxHeight: 319,
      width: arzChandStore.bounds.width,
      x: arzChandStore.bounds.x,
      y: arzChandStore.bounds.y,
      title: widgetKey.ArzChand,
      html: 'arzchand.html',
      devTools: true,
      alwaysOnTop: arzChandStore.alwaysOnTop,
      reziable: true,
    })
    onMoved(arzChandWindow)
    onResized(arzChandWindow)
    if (!mainWin) {
      mainWin = arzChandWindow
    }
  }

  // Weather widget
  if (weatherStore.enable) {
    const weatherWindow = await createWindow({
      height: weatherStore.bounds.height,
      minWidth: 183,
      minHeight: 203,
      width: weatherStore.bounds.width,
      x: weatherStore.bounds.x,
      y: weatherStore.bounds.y,
      title: widgetKey.Weather,
      html: 'weather.html',
      devTools: true,
      alwaysOnTop: weatherStore.alwaysOnTop,
      reziable: true,
    })
    onMoved(weatherWindow)
    onResized(weatherWindow)
    if (!mainWin) {
      mainWin = weatherWindow
    }
  }

  if (!mainWin) {
    mainWin = await createSettingWindow()
  }
  const appVersion = app.getVersion()
  if (store.get('currenctVersion') !== appVersion) {
    store.set('currenctVersion', appVersion)
    const settingPage = await createSettingWindow()
    settingPage.once('ready-to-show', async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      settingPage.webContents.send('update-details', { hello: 'world' })
    })
  }

  nativeTheme.themeSource = store.get('theme')
  createTray()
  update(mainWin, app)
}

interface Window {
  height: number
  minHeight: number
  width: number
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
}
async function createWindow(payload: Window) {
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
    movable: true,
    center: true,
    x: payload.x || undefined,
    y: payload.y || undefined,
    title: payload.title,
    titleBarStyle: 'hidden',
  })

  if (os.platform() == 'darwin') win.setWindowButtonVisibility(false)
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
    win.webContents.send('transparent_status', {
      newStatus: store.get(widgetKey[payload.title]).transparentStatus,
    })
    const borderRaduis = store.get(widgetKey[payload.title]).borderRaduis
    win.webContents.send('border-radius', {
      raduis: borderRaduis ? `${borderRaduis}px` : '28px',
    })
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(`${VITE_DEV_SERVER_URL}/html/${payload.html}`)
  } else {
    win.loadFile(path.join(process.env.DIST, '/html', payload.html))
  }
  return win
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

  appIcon.on('double-click', function () {
    mainWin.show()
  })

  appIcon.setToolTip('bTime')

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
      click: async function () {
        let settingWin = BrowserWindow.getAllWindows().find(
          (win) => win.getTitle() === 'Setting'
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
      icon: store.get('startup') && getIcon('icons/checked.png'),
      visible: isWindoAndDrawin,
      click: function () {
        const startupStatus = store.get('startup')
        const newValue = !startupStatus
        store.set('startup', newValue)
        toggleStartUp(app, newValue)
        contextMenu.closePopup()
        createTray()
      },
    },
    {
      label: 'Website',
      icon: getIcon('icons/link.png').resize({ height: 19, width: 19 }),
      click: function () {
        shell.openExternal('https://github.com/sajjadmrx/btime-desktop')
      },
    },
    {
      label: 'Restart',
      icon: getIcon('icons/restart.png'),
      click: function () {
        app.relaunch()
        app.exit(0)
      },
    },
    {
      label: 'Quit bTime',
      icon: getIcon('icons/power.png'),
      click: function () {
        app.exit(1)
      },
    },
  ])

  return contextMenu
}

export async function createSettingWindow() {
  const isExist = BrowserWindow.getAllWindows().find(
    (win) => win.getTitle() === 'Setting'
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
    x: 0,
    y: 0,
    title: 'Setting',
    html: 'setting.html',
    devTools: true,
    alwaysOnTop: true,
    reziable: false,
  })
}

function onMoved(win: BrowserWindow) {
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
          x: win.getBounds().x,
          y: win.getBounds().y,
          width: win.getBounds().width,
          height: win.getBounds().height,
        },
      })
    }
  })
}
function onResized(win: BrowserWindow) {
  win.on('resize', () => {
    if (win) {
      const { width, height } = win.getBounds()
      const key = win.getTitle()

      console.log(`Saving ${key} bounds: ${width}x${height}`)
      store.set(widgetKey[key], {
        ...store.get(widgetKey[key]),
        bounds: {
          x: win.getBounds().x,
          y: win.getBounds().y,
          width: win.getBounds().width,
          height: win.getBounds().height,
        },
      })
    }
  })
}

function isPointWithinDisplay(x: number, y: number) {
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
