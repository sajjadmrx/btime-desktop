// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react'
import ReactDOM from 'react-dom/client'
import '../index.css'
import './app.css'
import { ThemeProvider } from '@material-tailwind/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './sub-shomaar'

const queryClient = new QueryClient()

if (document.getElementById('root')) {
	ReactDOM.createRoot(document.getElementById('root')).render(
		<React.StrictMode>
			<ThemeProvider>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</ThemeProvider>
		</React.StrictMode>,
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
