import { randomUUID } from 'node:crypto'
import axios from 'axios'
import { getMainApi } from '../src/api/api'
import { store } from './store'

export async function logAppStartupEvent() {
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
			version: process.env.APP_VERSION,
			userId: userId,
		})

		return response.data
	} finally {
	}
}
