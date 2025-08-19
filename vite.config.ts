import { rmSync } from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import renderer from 'vite-plugin-electron-renderer'
import electron from 'vite-plugin-electron/simple'
import pkg from './package.json'

export default defineConfig(({ command }) => {
	rmSync('dist-electron', { recursive: true, force: true })
	const isServe = command === 'serve'
	const isBuild = command === 'build'
	const sourcemap = isServe || !!process.env.VSCODE_DEBUG
	return {
		build: {
			rollupOptions: {
				input: {
					time: path.join(__dirname, './html/time.html'), // <-----------------------------------------------------------------------
					rate: path.join(__dirname, './html/rate.html'),
					setting: path.join(__dirname, './html/setting.html'),
					arzchand: path.join(__dirname, './html/arzchand.html'),
					weather: path.join(__dirname, './html/weather.html'),
					clock: path.join(__dirname, './html/clock.html'),
					'dam-dasti': path.join(__dirname, './html/dam-dasti.html'),
					'sub-shomaar': path.join(__dirname, './html/sub-shomaar.html'),
					parent: path.join(__dirname, './html/parent.html'),
					initial: path.join(__dirname, './html/initial.html'),
				},
			},
		},
		plugins: [
			react(),
			electron({
				main: {
					entry: 'electron/main.ts', // Entry point for Electron main process
				},
				preload: {
					input: path.join(__dirname, 'electron/preload.ts'), // Preload script for Electron
				},
				renderer: {}, // Handles polyfills for renderer process
			}),
			renderer(),
		],
		server:
			process.env.VSCODE_DEBUG &&
			(() => {
				// @ts-ignore
				const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
				return {
					host: url.hostname,
					port: +url.port,
				}
			})(),
		define: {
			'import.meta.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
		},
	}
})
