import { useCallback, useEffect } from 'react'

export const useThemeMode = () => {
	const handleColorSchemeChange = useCallback(
		(e: MediaQueryListEvent | MediaQueryList) => {
			// document.documentElement.classList.remove('dark')
			// if (e.matches) {
			// 	document.documentElement.classList.add('dark')
			// }
		},
		[],
	)

	useEffect(() => {
		const colorSchemeMediaQuery = window.matchMedia(
			'(prefers-color-scheme: dark)',
		)
		handleColorSchemeChange(colorSchemeMediaQuery)
		colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)

		return () => {
			colorSchemeMediaQuery.removeEventListener(
				'change',
				handleColorSchemeChange,
			)
		}
	}, [handleColorSchemeChange])
}
