import { app, BrowserWindow, Menu, nativeImage, shell, Tray, nativeTheme } from 'electron'
import path from 'node:path'
import { store } from './store';
import { join } from "node:path";
import { config } from "dotenv";
import { getIconPath, getPublicFilePath } from '../shared/getIconPath';
import os from "os";
import { update } from './update';
import isDev from "electron-is-dev";
import { release } from "node:os";

config();


process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "./dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "./public")
  : process.env.DIST;


let win: BrowserWindow | null;
const icon = nativeImage.createFromPath(getIconPath());
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']


if (release().startsWith("6.1")) app.disableHardwareAcceleration();

if (process.platform === "win32")
  app.setAppUserModelId(app.getName());


if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}


if (isDev)
  Object.defineProperty(app, "isPackaged", {
    get() {
      return true;
    },
  });

async function createWindow() {
  win = new BrowserWindow({
    icon: getIconPath(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: false,
      nodeIntegration: true,
      contextIsolation: true,
    },
    height: 180,
    width: 170,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: store.get("alwaysOnTop"),
    skipTaskbar: true,

    movable: true,
    center: true,
    x: store.get("bounds").x,
    y: store.get("bounds").y,
    title: "bTime",
    titleBarStyle: "hidden",
  })
  createTray()
  win.on("moved", () => {
    if (win) {
      const { x, y } = win.getBounds()
      store.set("bounds", { x, y })
    }
  });

  if (os.platform() == "darwin") win.setWindowButtonVisibility(false);
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  nativeTheme.themeSource = store.get("theme")

  update(win, app)
}

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});


app.on('activate', () => {

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()


  }


})

app.whenReady().then(createWindow)

function getIcon(name: string) {
  return nativeImage.createFromPath(
    getPublicFilePath(name)
  );
}

let createdTray: Tray | null = null;
function createTray() {
  if (createdTray)
    createdTray.destroy()

  const appIcon = new Tray(icon);

  const contextMenu = getContextMenu()

  appIcon.on("double-click", function () {
    win.show();
  });

  appIcon.setToolTip("bTime");

  appIcon.setContextMenu(contextMenu);
  createdTray = appIcon
  return appIcon;
}

function getContextMenu() {
  const alwaysOnTop: boolean = store.get("alwaysOnTop")
  const currentTheme = store.get("theme")
  const contextMenu = Menu.buildFromTemplate([
    {
      label: `B Time | ${app.getVersion()}`,
      enabled: false,
      icon: icon.resize({ height: 19, width: 19 }),
    },
    {
      label: "Theme",
      icon: getIcon("icons/theme.png"),
      submenu: [
        {
          label: "Dark",
          icon: currentTheme == "dark" && getIcon("icons/checked.png"),
          click: function () {
            nativeTheme.themeSource = "dark"
            store.set("theme", "dark")
            createTray()
          },
        },
        {
          label: "Light",
          icon: currentTheme == "light" && getIcon("icons/checked.png"),
          click: function () {
            nativeTheme.themeSource = "light"
            store.set("theme", "light")
            createTray()
          },
        }
      ]
    },
    {
      label: "Options",
      icon: getIcon("icons/options.png"),
      submenu: [
        {
          label: "alwaysOnTop",
          icon: alwaysOnTop && getIcon("icons/checked.png"),
          click: function () {
            store.set("alwaysOnTop", !alwaysOnTop)
            contextMenu.closePopup()
            createTray()
            win.setAlwaysOnTop(!alwaysOnTop)
          }
        }
      ]
    },
    {
      label: "Website",
      icon: getIcon("icons/link.png"),
      click: function () {
        shell.openExternal("https://github.com/sajjadmrx/btime-desktop");
      },
    },
    {
      label: "Quit bTime",
      icon: getIcon("icons/power.png"),
      click: function () {
        app.exit(1);
      },
    },

  ]);

  return contextMenu
}