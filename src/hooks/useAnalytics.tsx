import { useEffect } from 'react'
import ReactGA from 'react-ga4'

export const useAnalytics = (widgetName: string) => {
	useEffect(() => {
		ReactGA.initialize('G-T2SYTC8P3X')
		ReactGA.event({
			action: widgetName,
			category: widgetName,
			label: widgetName,
		})
	}, [])
}
