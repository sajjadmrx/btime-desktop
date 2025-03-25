import type { ArzChandSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { MdOutlineDragIndicator } from 'react-icons/md'
import { StoreKey } from '../../electron/store'
import { widgetKey } from '../../shared/widgetKey'
import { CurrenciesClassic } from './templates/classic'
import { CurrenciesDefault } from './templates/default'

function App() {
	const [setting, setSetting] = useState<ArzChandSettingStore>(
		window.store.get(widgetKey.ArzChand),
	)

	const [isTransparent, setIsTransparent] = useState<boolean>(false)
	const [isBackgroundActive, setBackgroundActive] = useState<boolean>(false)

	useEffect(() => {
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

		const observer = new MutationObserver(() => {
			setIsTransparent(
				document
					.querySelector('.h-screen')
					?.classList?.contains('transparent-active'),
			)
		})

		const observerBackground = new MutationObserver(() => {
			setBackgroundActive(
				document.querySelector('.h-screen')?.classList?.contains('background'),
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

		window.ipcRenderer.on('updated-setting', () => {
			const arzChandSetting = window.store.get(widgetKey.ArzChand)
			setSetting(arzChandSetting)
		})

		return () => {
			colorSchemeMediaQuery.removeEventListener(
				'change',
				handleColorSchemeChange,
			)
			observer.disconnect()
			observerBackground.disconnect()
		}
	}, [])

	return (
		<div className="w-screen h-screen overflow-hidden">
			<div className="h-full">
				<div className="flex flex-col items-center h-full p-2">
					{setting.template === 'default' || !setting.template ? (
						<CurrenciesDefault
							currencies={setting.currencies}
							isBackgroundActive={isBackgroundActive}
							isTransparent={isTransparent}
						/>
					) : (
						<CurrenciesClassic
							currencies={setting.currencies}
							isTransparent={isTransparent}
							isBackgroundActive={isBackgroundActive}
						/>
					)}
					<div
						className="flex items-center w-full h-10 p-2 mt-2 transition-all duration-300 ease-in-out overflow-clip"
						dir="rtl"
					>
						<button
							className={`w-7 h-7  moveable flex justify-center items-center rounded-full 
								cursor-pointer hover:text-gray-300 dark:hover:bg-[#3c3c3c8a] dark:text-gray-400/90
								dark:bg-transparent
								${isTransparent ? 'text-gray-300' : 'text-gray-500'} 
							`}
							style={{ backdropFilter: 'blur(20px)' }}
						>
							<MdOutlineDragIndicator />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default App
//bg-gray-400/50
