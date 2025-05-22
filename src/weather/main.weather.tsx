// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react'
import ReactDOM from 'react-dom/client'
import '../index.css'
import './app.css'
import { ThemeProvider } from '@material-tailwind/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './app.weather'

const queryClient = new QueryClient()

if (document.getElementById('root')) {
	ReactDOM.createRoot(document.getElementById('root')).render(
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</ThemeProvider>,
	)
}

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

window.ipcRenderer.on('border-radius', (evt, message) => {
	document.querySelector('.h-screen').style.borderRadius = message.radius
})
