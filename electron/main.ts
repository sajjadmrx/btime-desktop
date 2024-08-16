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
    height: 190,
    width: 170,
    x: store.get(widgetKey.BTime).bounds.x,
    y: store.get(widgetKey.BTime).bounds.y,
    title: widgetKey.BTime,
    html: 'index.html',
    devTools: false,
    alwaysOnTop: store.get(widgetKey.BTime).alwaysOnTop,
  })
  mainWin = calanderWin
  onMoved(calanderWin)

  if (nerkhStore.enable) {
    const nerkhWindow = await createWindow({
      height: 190,
      width: 240,
      x: store.get(widgetKey.NerkhYab).bounds.x,
      y: store.get(widgetKey.NerkhYab).bounds.y,
      title: widgetKey.NerkhYab,
      html: 'rate.html',
      devTools: true,
      alwaysOnTop: store.get(widgetKey.NerkhYab).alwaysOnTop,
    })
    onMoved(nerkhWindow)
  }

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
    resizable: false,
    alwaysOnTop: payload.alwaysOnTop,
    skipTaskbar: true,

    movable: true,
    center: true,
    x: payload.x,
    y: payload.y,
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

  // if (VITE_DEV_SERVER_URL) {
  win.loadURL(VITE_DEV_SERVER_URL + payload.html)
  // } else {
  //   win.loadFile(path.join(process.env.DIST, payload.html))
  // }

  nativeTheme.themeSource = 'light' //store.get(widgetKey[payload.title]).theme

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
  if (BrowserWindow.getAllWindows().length === 0) {
    // createWindow(mainWin)
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
  // const alwaysOnTop: any = false // store.get('alwaysOnTop')
  // const currentTheme: any = 'system' //store.get('theme')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: `B Time | ${app.getVersion()}`,
      enabled: false,
      icon: icon.resize({ height: 19, width: 19 }),
    },
    // {
    //   label: 'Theme',
    //   icon: getIcon('icons/theme.png').resize({ height: 19, width: 19 }),
    //   submenu: [
    //     {
    //       label: 'System',
    //       icon: currentTheme == 'system' && getIcon('icons/checked.png'),
    //       click: function () {
    //         nativeTheme.themeSource = 'system'
    //         store.set('theme', 'system')
    //         createTray()
    //       },
    //     },
    //     {
    //       label: 'Dark',
    //       icon: currentTheme == 'dark' && getIcon('icons/checked.png'),
    //       click: function () {
    //         nativeTheme.themeSource = 'dark'
    //         store.set('theme', 'dark')
    //         createTray()
    //       },
    //     },
    //     {
    //       label: 'Light',
    //       icon: currentTheme == 'light' && getIcon('icons/checked.png'),
    //       click: function () {
    //         nativeTheme.themeSource = 'light'
    //         store.set('theme', 'light')
    //         createTray()
    //       },
    //     },
    //   ],
    // },
    // {
    //   label: 'Options',
    //   icon: getIcon('icons/options.png').resize({ height: 19, width: 19 }),
    //   submenu: [
    //     {
    //       label: 'AlwaysOnTop',
    //       icon: alwaysOnTop && getIcon('icons/checked.png'),
    //       click: function () {
    //         store.set('alwaysOnTop', !alwaysOnTop)
    //         contextMenu.closePopup()
    //         createTray()
    //         mainWin.setAlwaysOnTop(!alwaysOnTop)
    //       },
    //     },
    //     {
    //       label: 'Transparent',
    //       icon: store.get('transparentStatus') && getIcon('icons/checked.png'),
    //       click: function () {
    //         const transparetStatus = store.get('transparentStatus')
    //         const newValue = !transparetStatus
    //         store.set('transparentStatus', newValue)
    //         contextMenu.closePopup()
    //         createTray()
    //         mainWin.webContents.send('transparent_status', {
    //           newStatus: newValue,
    //         })
    //       },
    //     },
    //     {
    //       label: 'Open at boot',
    //       icon: store.get('startup') && getIcon('icons/checked.png'),
    //       visible: isWindoAndDrawin,
    //       click: function () {
    //         const startupStatus = store.get('startup')
    //         const newValue = !startupStatus
    //         store.set('startup', newValue)
    //         toggleStartUp(app, newValue)
    //         contextMenu.closePopup()
    //         createTray()
    //       },
    //     },
    //   ],
    // },
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
        bounds: { x, y },
      })
    }
  })
}
