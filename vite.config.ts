import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import renderer from 'vite-plugin-electron-renderer'
import { rmSync } from 'node:fs'

export default defineConfig(() => {
  rmSync('dist-electron', { recursive: true, force: true })

  return {
    build: {
      rollupOptions: {
        input: {
          index: path.join(__dirname, './html/index.html'), // <-----------------------------------------------------------------------
          rate: path.join(__dirname, './html/rate.html'),
          setting: path.join(__dirname, './html/setting.html'),
          arzchand: path.join(__dirname, './html/arzchand.html'),
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
    define: {},
  }
})
