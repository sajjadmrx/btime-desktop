import { app, BrowserWindow, ipcMain, nativeTheme, shell } from 'electron'
import { store, StoreKey } from './store'
import { createSettingWindow } from './main'
import { widgetKey } from '../shared/widgetKey'

export function initIpcMain() {
  ipcMain.on('reOpen', () => {
    app.relaunch()
    app.exit()
  })

  ipcMain.on('changeTheme', (event, theme: StoreKey['theme']) => {
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
      (win) => win.title === windowKey
    )[0]
    if (win) {
      win.webContents.send('transparent_status', {
        newStatus: store.get(widgetKey[windowKey]).transparentStatus,
      })
    }
  })
}
