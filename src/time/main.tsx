// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../index.css'
import './time.css'
import { ThemeProvider } from '@material-tailwind/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
if (document.getElementById('root')) {
	ReactDOM.createRoot(document.getElementById('root')).render(
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</QueryClientProvider>,
	)
}

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
	console.log(message)
})

window.ipcRenderer.on('transparent_status', (evt, message) => {
	const bodyElement = document.querySelector('.h-screen')
	if (message.enableTransparent) {
		bodyElement.classList.add('transparent-active')
	} else bodyElement.classList.remove('transparent-active')
})

window.ipcRenderer.on('background_status', (evt, message) => {
	const bodyElement = document.querySelector('.h-screen')

	if (message.isBackgroundDisabled) {
		bodyElement.classList.remove('background')
	} else bodyElement.classList.add('background')
})

window.ipcRenderer.on('border-radius', (evt, message) => {
	document.querySelector('.h-screen').style.borderRadius = message.radius
})
