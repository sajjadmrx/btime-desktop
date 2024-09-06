import { autoUpdater } from 'electron-updater'
import isDev from 'electron-is-dev'
import ms from 'ms'
import eLogger from 'electron-log'
export function update(win: Electron.BrowserWindow, app: Electron.App) {
  autoUpdater.autoDownload = true
  autoUpdater.disableWebInstaller = false

  autoUpdater.allowDowngrade = false
  autoUpdater.fullChangelog = true

  autoUpdater.logger = eLogger

  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'sajjadmrx',
    repo: 'btime-desktop',
  })

  autoUpdater.on('checking-for-update', function () {
    autoUpdater.logger.info('checking....')
  })

  autoUpdater.on('update-available', (arg) => {
    win.webContents.send('update-can-available', {
      update: true,
      version: app.getVersion(),
      notes: arg.releaseNotes,
      newVersion: arg?.version,
    })
  })

  autoUpdater.on('update-not-available', (arg) => {
    win.webContents.send('update-can-available', {
      update: false,
      version: app.getVersion(),
      newVersion: arg?.version,
    })
    autoUpdater.logger.info('update not found')
  })

  autoUpdater.on('error', (e) => {
    autoUpdater.logger.error(e.message)
  })

  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall(false, true)
  })

  async function checkUpdate() {
    try {
      if (autoUpdater.autoDownload) {
        autoUpdater.logger.info('start Checking Update...')
        return await autoUpdater.checkForUpdates()
      }
    } catch (error) {
      autoUpdater.logger.error(error.message)
    }
  }
  if (autoUpdater.autoDownload && !isDev) {
    checkUpdate()
    setInterval(() => {
      checkUpdate()
    }, ms('3h'))
  }
}
