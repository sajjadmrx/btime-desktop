import { app, ipcMain, nativeTheme } from 'electron'
import { StoreKey } from './store'
import { createSettingWindow } from './main'

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
}
