// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react'
import ReactDOM from 'react-dom/client'
import '../index.css'
import './app.css'
import { ThemeProvider } from '@material-tailwind/react'
import { AuthProvider } from '../context/auth.context'
import App from './setting'
if (document.getElementById('root')) {
	ReactDOM.createRoot(document.getElementById('root')).render(
		<ThemeProvider>
			<AuthProvider>
				<App />
			</AuthProvider>
		</ThemeProvider>,
	)
}

postMessage({ payload: 'removeLoading' }, '*')
