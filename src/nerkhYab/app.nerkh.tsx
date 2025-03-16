import { useEffect, useState } from 'react'
import { widgetKey } from '../../shared/widgetKey'
import { type FetchedCurrency, getRateByCurrency } from '../api/api'
import { extractMainColorFromImage } from '../utils/colorUtils'

function App() {
	const [loading, setLoading] = useState(true)
	const [currency, setCurrency] = useState<string>()
	const [imgColor, setImgColor] = useState<string>()
	const [currencyData, setCurrencyData] = useState<FetchedCurrency>(null)
	const [isBackgroundActive, setBackgroundActive] = useState<boolean>(false)
	const [isTransparent, setIsTransparent] = useState<boolean>(false)

	useEffect(() => {
		const currencyStore = window.store.get(widgetKey.NerkhYab)
		setCurrency(currencyStore.currencies[0])
		const handleColorSchemeChange = (e) => {
			document.documentElement.classList.remove('dark')
			if (e.matches) {
				document.documentElement.classList.add('dark')
			}
		}

		const colorSchemeMediaQuery = window.matchMedia(
			'(prefers-color-scheme: dark)',
		)
		handleColorSchemeChange(colorSchemeMediaQuery)

		window.ipcRenderer.on('updated-setting', () => {
			const currencyStore = window.store.get(widgetKey.NerkhYab)
			setCurrency(currencyStore.currencies[0])
		})

		const observerBackground = new MutationObserver(() => {
			setBackgroundActive(
				document.querySelector('.h-screen')?.classList?.contains('background'),
			)
		})

		const observer = new MutationObserver(() => {
			setIsTransparent(
				document
					.querySelector('.h-screen')
					.classList.contains('transparent-active'),
			)
		})

		observer.observe(document.querySelector('.h-screen'), {
			attributes: true,
			attributeFilter: ['class'],
		})

		observerBackground.observe(document.querySelector('.h-screen'), {
			attributes: true,
			attributeFilter: ['class'],
		})

		colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)
		return () => {
			colorSchemeMediaQuery.removeEventListener(
				'change',
				handleColorSchemeChange,
			)
			observerBackground.disconnect()
			observer.disconnect()
		}
	}, [])

	useEffect(() => {
		async function fetchData() {
			const data = await getRateByCurrency(currency)
			if (data) {
				setCurrencyData(data)
				setLoading(false)
			}
		}

		if (currency) {
			fetchData()

			return () => {
				setCurrencyData(undefined)
				setLoading(true)
			}
		}
	}, [currency])

	useEffect(() => {
		if (currencyData && currency) {
			extractMainColorFromImage(currencyData.icon).then((color) => {
				setImgColor(color)
			})
		}
	}, [currencyData, currency])

	return (
		<div className="w-screen h-screen overflow-hidden" dir="rtl">
			<div className="h-full px-0 py-3 moveable" dir="rtl">
				<div
					className="flex flex-col items-center justify-around h-full gap-6"
					dir="rtl"
				>
					<div
						className="flex flex-col flex-wrap items-center justify-around w-full h-full gap-5 px-2"
						style={{ maxHeight: '80vh' }}
						dir="rtl"
					>
						<div
							className="relative flex flex-col items-center justify-around h-full gap-6"
							dir="ltr"
						>
							<div className="flex flex-row flex-wrap items-center justify-around w-full space-x-1">
								<div>
									{loading ? (
										<div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700"></div>
									) : (
										<div
											className={'w-10 h-10 relative flex rounded-full'}
											style={{
												backdropFilter: 'blur(100px)',
											}}
										>
											<div
												className={`
           w-32 h-10 absolute rounded-full z-0 -left-10 blur-lg `}
												style={{
													backgroundImage: `radial-gradient(50% 50% at 50% 50%, ${imgColor} 35%, ${`${imgColor}00`} 50%)`,
												}}
											></div>
											<img
												src={currencyData.icon}
												className="z-10 object-cover rounded-full"
											/>
										</div>
									)}
								</div>
								<div className="flex flex-col items-end w-32 truncate justify ">
									{loading ? (
										<div className="h-5 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-2.5"></div>
									) : (
										<h3
											className={`lg:text-[1.1rem] sm:text-sm font-normal  truncate w-32 ${getTextColor(isTransparent, isBackgroundActive)}`}
											dir="rtl"
										>
											{currencyData.name.en}
										</h3>
									)}
								</div>
							</div>
							<div className="flex flex-row items-center w-full">
								<div className="flex flex-col">
									<div>
										{loading ? (
											<div className="h-2 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-10 mb-2.5"></div>
										) : (
											<p
												className={`lg:text-[1.2rem] sm:text-sm md:text-[.9rem] ${getTextColor(isTransparent, isBackgroundActive)}`}
											>
												{currencyData.rialPrice.toLocaleString()}
											</p>
										)}
									</div>
									<div>
										{loading ? (
											<div className="h-2 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-5 mb-2.5"></div>
										) : (
											<p
												className={`text-xs font-light ${getTextColor(isTransparent, isBackgroundActive)}`}
											>
												1 {currency.toUpperCase()}
											</p>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default App

function getTextColor(isTransparent: boolean, isBackgroundActive: boolean) {
	let textColor = 'text-gray-600 dark:text-[#d3d3d3]'
	if (isTransparent || !isBackgroundActive) {
		textColor = 'text-gray-200 text-gray-trasnparent'
	}
	return textColor
}
