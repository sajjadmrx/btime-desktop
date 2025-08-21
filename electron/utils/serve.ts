import http from 'node:http'
import * as path from 'node:path'
import Url from 'node:url'
import type { BrowserWindow } from 'electron'
import handler from 'serve-handler'
import getPorts from './get-port'
import isDev from './isDev'

// Internals
// =========
const isDevelopment = isDev

// Dynamic Renderer
// ================
export default async function (mainWindow: BrowserWindow) {
	if (isDevelopment) {
		const startUrl = Url.format({
			pathname: path.join(process.env.DIST, '/html/initial.html'),
			protocol: 'file:',
			slashes: true,
		})
		return mainWindow.loadURL(startUrl)
	}

	const port = await getPorts({ port: 55303 })

	const server = http.createServer((request, response) => {
		return handler(request, response, {
			public: path.join(process.env.DIST, '/html/initial.html'),
			directoryListing: false,
		})
	})

	await new Promise((resolve) => {
		server.listen(port, () => {
			console.log('Dynamic-Renderer Listening on', port)
			mainWindow.loadURL(`http://localhost:${port}`)
			resolve(true)
		})
	})
}
