import { useEffect } from 'react'
import ReactGA from 'react-ga4'

export const useAnalytics = (widgetName: string) => {
	useEffect(() => {
		ReactGA.initialize('G-10KJSV5VNM')
		ReactGA.event({
			action: widgetName,
			category: widgetName,
			label: widgetName,
		})
	}, [])
}
