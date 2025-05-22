import { randomUUID } from 'node:crypto'
import axios from 'axios'
import { BrowserWindow } from 'electron'
import { getMainApi } from '../src/api/api'
import { store } from './store'

export async function logAppStartupEvent(app: Electron.App) {
	const api = await getMainApi()
	const client = await axios.create({
		baseURL: api,
		headers: {
			'Content-Type': 'application/json',
		},
	})

	try {
		let userId = store.get('main').userId
		if (!userId) {
			userId = randomUUID()
		}

		const response = await client.post('/analytics/desktop', {
			event: 'app_startup',
			os: process.platform,
			version: app.getVersion(),
			metadata: {
				totalOpenWindows: BrowserWindow.getAllWindows().length,
				openedWindows: BrowserWindow.getAllWindows().map((win) => ({
					title: win.getTitle(),
					id: win.id,
				})),
			},
			userId: userId,
		})

		return response.data
	} finally {
	}
}
