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

  ipcMain.handle('getBorderRadius', async (event, window: string) => {
    try {
      const win = BrowserWindow.getAllWindows().filter(
        (win) => win.title === window
      )[0]
      const color = await win.webContents.executeJavaScript(`
 getComputedStyle(document.querySelector('.h-screen')).borderRadius
  `)

      console.log(color)
      return color
    } catch (error) {
      console.error(error)
      return ''
    }
  })

  ipcMain.handle(
    'setBorderRadius',
    async (event, window: string, value: string) => {
      const win = BrowserWindow.getAllWindows().filter(
        (win) => win.title === window
      )[0]

      await win.webContents.executeJavaScript(
        `
        document.querySelector('.h-screen').style.borderRadius = '${value}'
        `,
        true
      )
    }
  )
}
