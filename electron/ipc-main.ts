import { app, ipcMain } from 'electron'

export function initIpcMain() {
  ipcMain.on('reOpen', () => {
    app.relaunch()
    app.exit()
  })
}
