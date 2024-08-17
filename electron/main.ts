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
import { store, widgetKey } from './store'
import { join } from 'node:path'
import { config } from 'dotenv'
import { getIconPath, getPublicFilePath } from '../shared/getIconPath'
import os from 'os'
import { update } from './update'
import isDev from 'electron-is-dev'
import { release } from 'node:os'
import { toggleStartUp } from './utils/startup.util'
import { initIpcMain } from './ipc-main'

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

  const calanderWin = await createWindow({
    height: store.get(widgetKey.BTime).bounds.height,
    width: store.get(widgetKey.BTime).bounds.width,
    x: store.get(widgetKey.BTime).bounds.x,
    y: store.get(widgetKey.BTime).bounds.y,
    title: widgetKey.BTime,
    html: 'index.html',
    devTools: false,
    alwaysOnTop: store.get(widgetKey.BTime).alwaysOnTop,
    reziable: true,
  })
  mainWin = calanderWin
  onMoved(calanderWin)
  onResized(calanderWin)

  if (nerkhStore.enable) {
    const nerkhWindow = await createWindow({
      height: store.get(widgetKey.NerkhYab).bounds.height,
      width: store.get(widgetKey.NerkhYab).bounds.width,
      x: store.get(widgetKey.NerkhYab).bounds.x,
      y: store.get(widgetKey.NerkhYab).bounds.y,
      title: widgetKey.NerkhYab,
      html: 'rate.html',
      devTools: true,
      alwaysOnTop: store.get(widgetKey.NerkhYab).alwaysOnTop,
      reziable: true,
    })
    onMoved(nerkhWindow)
    onResized(nerkhWindow)
  }

  nativeTheme.themeSource = store.get('theme')
  createTray()
  update(mainWin, app)
}

interface Window {
  height: number
  width: number
  x: number
  y: number
  title: string
  html: string
  devTools: boolean
  alwaysOnTop: boolean
  reziable: boolean
}
async function createWindow(payload: Window) {
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
    frame: false,
    transparent: true,
    resizable: payload.reziable,
    alwaysOnTop: payload.alwaysOnTop,
    skipTaskbar: true,

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
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL + payload.html)
  } else {
    win.loadFile(path.join(process.env.DIST, payload.html))
  }

  return win
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    mainWin = null
  }
})

app.on('quit', () => {
  console.log('quit')
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
      label: `B Time | ${app.getVersion()}`,
      enabled: false,
      icon: icon.resize({ height: 19, width: 19 }),
    },
    {
      label: 'Settings',
      icon: getIcon('icons/settings.png').resize({ height: 19, width: 19 }),
      click: async function () {
        let settingWin = BrowserWindow.getAllWindows().find(
          (win) => win.getTitle() === 'Setting'
        )
        if (settingWin) {
          settingWin.show()
        } else {
          settingWin = await createWindow({
            height: 650,
            width: 420,
            x: 0,
            y: 0,
            title: 'Setting',
            html: 'setting.html',
            devTools: true,
            alwaysOnTop: true,
            reziable: true,
          })
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
      label: 'Quit bTime',
      icon: getIcon('icons/power.png'),
      click: function () {
        app.exit(1)
      },
    },
  ])

  return contextMenu
}

function onMoved(win: BrowserWindow) {
  win.on('moved', () => {
    if (win) {
      let { x, y } = win.getBounds()
      const { width, height } = screen.getPrimaryDisplay().workAreaSize

      // Check if the window is out of bounds and adjust the position
      if (x < 0) {
        x = 0
      } else if (x + win.getBounds().width > width) {
        x = width - win.getBounds().width
      }

      if (y < 0) {
        y = 0
      } else if (y + win.getBounds().height > height) {
        y = height - win.getBounds().height
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
      console.log(key, width, height)

      const filters: Record<
        widgetKey,
        {
          minWidth: number
          minHeight: number
        }
      > = {
        [widgetKey.BTime]: {
          minWidth: 180,
          minHeight: 179,
        },
        [widgetKey.NerkhYab]: {
          minWidth: 226,
          minHeight: 120,
        },
      }
      const filter = filters[key]
      if (!filter) return
      if (width < filter.minWidth) {
        win.setSize(filter.minWidth, win.getBounds().height)
      }

      if (height < filter.minHeight) {
        win.setSize(win.getBounds().width, filter.minHeight)
      }

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
