import { Notification, nativeImage } from 'electron'
import isDev from 'electron-is-dev'
import eLogger from 'electron-log'
import { autoUpdater } from 'electron-updater'
import ms from 'ms'
import { getIconPath } from '../shared/getIconPath'

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

	autoUpdater.on('checking-for-update', () => {
		autoUpdater.logger.info('checking....')
	})

	autoUpdater.on('update-available', () => {
		new Notification({
			title: '📥 نسخه جدید ویجتی‌فای در دسترس قرار گرفت',
			body: 'نسخه جدید در حال بارگیری و نصب است لطفا منتظر بمانید...',
			subtitle: 'بروزرسانی',
			icon: nativeImage.createFromPath(getIconPath()),
		}).show()
		autoUpdater.logger.info('update available')
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
