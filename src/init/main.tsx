import ReactDOM from 'react-dom/client'
import { useAnalytics } from '../hooks/useAnalytics'

function App() {
	useAnalytics('startup')
	return <div></div>
}

const rootElement = document.getElementById('root')
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(<App />)
}

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')
