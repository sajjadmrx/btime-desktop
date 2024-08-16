import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import renderer from 'vite-plugin-electron-renderer'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: path.join(__dirname, './src/index.html'), // <-----------------------------------------------------------------------
        rate: path.join(__dirname, './src/rate.html'),
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
  server: {
    // headers: {
    //   'Content-Security-Policy': [
    //     "default-src 'self' 'unsafe-inline' data:;",
    //     "script-src 'self' 'unsafe-eval' 'unsafe-inline' data:;",
    //     "img-src 'self' blob: data: https://via.placeholder.com",
    //   ].join(' '),
    // },
  },
  define: {},
})
