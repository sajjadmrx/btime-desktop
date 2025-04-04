import { rmSync } from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import renderer from 'vite-plugin-electron-renderer'
import electron from 'vite-plugin-electron/simple'
import pkg from './package.json'

export default defineConfig(() => {
	rmSync('dist-electron', { recursive: true, force: true })

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
					parent: path.join(__dirname, './html/parent.html'),
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
		server: {},
		define: {
			'import.meta.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
		},
	}
})
