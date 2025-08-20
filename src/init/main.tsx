import ReactDOM from 'react-dom/client'
import { useAnalytics } from '../hooks/useAnalytics'

function App() {
	useAnalytics('startup')
	return <div>Please wait while the app is loading...</div>
}

const rootElement = document.getElementById('root')
if (rootElement) {
	// @ts-ignore
	ReactDOM.createRoot(rootElement).render(<App />)
}

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')
