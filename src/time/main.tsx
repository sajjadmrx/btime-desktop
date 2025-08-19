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
