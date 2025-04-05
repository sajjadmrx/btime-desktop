import ms from 'ms'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { widgetKey } from '../../shared/widgetKey'
import { useGetYoutubeProfile } from '../api/hooks/channel/youtube-profile.hook'
import { CountUpAnimation } from '../hooks/useCountAnimation'
import { formatSubscribeCount } from '../utils/format'

function App() {
	const [isTransparent, setIsTransparent] = useState<boolean>(false)
	const [isBackgroundActive, setBackgroundActive] = useState<boolean>(false)
	const [channelName, setChannelName] = useState<string>('')
	const [subscriberFormat, setSubscriberFormat] = useState<'short' | 'full'>(
		'short',
	)

	const handleSettingsUpdate = useCallback(() => {
		const settings = window.store.get(widgetKey.SubShomaar)
		if (settings?.channelName) {
			if (settings?.channelName !== channelName) {
				setChannelName(settings.channelName)
			}
			setSubscriberFormat(settings?.subscriberFormat || 'short')
		}
	}, [channelName])

	useEffect(() => {
		const subShomaarSettings = window.store.get(widgetKey.SubShomaar)
		if (subShomaarSettings?.channelName) {
			setChannelName(subShomaarSettings.channelName)
		}
		setSubscriberFormat(subShomaarSettings?.subscriberFormat || 'short')

		window.ipcRenderer.on('updated-setting', handleSettingsUpdate)

		return () => {
			window.ipcRenderer.removeAllListeners('updated-setting')
		}
	}, [handleSettingsUpdate])

	const { data: channelInfo, isLoading } = useGetYoutubeProfile(
		channelName,
		!!channelName,
		ms('3m'),
	)

	const handleColorSchemeChange = useCallback((e) => {
		document.documentElement.classList.remove('dark')
		if (e.matches) {
			document.documentElement.classList.add('dark')
		}
	}, [])

	useEffect(() => {
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

		const targetElement = document.querySelector('.h-screen')
		if (targetElement) {
			observer.observe(targetElement, {
				attributes: true,
				attributeFilter: ['class'],
			})

			observerBackground.observe(targetElement, {
				attributes: true,
				attributeFilter: ['class'],
			})
		}

		colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)

		return () => {
			colorSchemeMediaQuery.removeEventListener(
				'change',
				handleColorSchemeChange,
			)
			observer.disconnect()
			observerBackground.disconnect()
		}
	}, [handleColorSchemeChange, channelInfo])

	const formattedSubscriberCount = useMemo(() => {
		if (!channelInfo?.isValid) return ''
		return subscriberFormat === 'short' ? (
			formatSubscribeCount(channelInfo.subscribers)
		) : (
			<CountUpAnimation end={channelInfo.subscribers} duration={1500} />
		)
	}, [subscriberFormat, channelInfo?.subscribers, channelInfo?.isValid])

	const getSubscribeCountStyle = () => {
		if (isTransparent) {
			return 'text-gray-200/80 dark:text-gray-200'
		}

		if (!isBackgroundActive) {
			return 'text-gray-300/90'
		}

		return 'text-gray-800 dark:text-gray-200/80'
	}

	const getTextColor = () => {
		if (isTransparent) {
			return 'text-gray-300/90 dark:text-gray-200'
		}

		if (!isBackgroundActive) {
			return 'text-gray-300'
		}

		return 'text-gray-800 dark:text-gray-100/80'
	}

	return (
		<div className="flex flex-col w-screen h-screen p-4 overflow-hidden transition-colors duration-300 moveable">
			{channelName ? (
				isLoading ? (
					<div className="flex items-center justify-center h-full">
						<div className="w-10 h-10 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
					</div>
				) : channelInfo?.isValid ? (
					<div className="flex flex-col items-center justify-center h-full gap-3 px-4">
						{channelInfo.profile && (
							<div className="overflow-hidden border-gray-200 rounded-full shadow-md xxs:w-14 xxs:h-14 xs:w-14 xs:h-14 sm:w-20 sm:h-20 w-28 h-28">
								<img
									src={channelInfo.profile}
									alt={channelInfo.name}
									className="object-cover w-full h-full"
									loading="eager"
								/>
							</div>
						)}
						<h1 className={`text-xl font-medium text-center ${getTextColor()}`}>
							{channelInfo.name}
						</h1>
						<div className="flex flex-col items-center">
							<span
								className={`text-3xl font-semibold font-[balooTamma] xxs:text-sm xs:text-lg sm:text-xl ${getSubscribeCountStyle()}`}
							>
								{formattedSubscriberCount}
							</span>
							<span
								className={`mt-1 text-base font-light text-[12px] xxs:text-xs ${getTextColor()} opacity-90`}
							>
								subscribers
							</span>
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-full">
						<div className="p-6 text-center">
							<p className="text-xl font-medium text-red-500">چنل نامعتبر</p>
							<p className="mt-2 text-base text-gray-600 dark:text-gray-400">
								لطفا تنظیمات را چک کنید
							</p>
						</div>
					</div>
				)
			) : (
				<div className="flex flex-col items-center justify-center h-full">
					<div className="p-6 text-center">
						<p className="text-xl font-medium text-gray-700 dark:text-gray-300">
							چنل انتخاب نشده
						</p>
						<p className="mt-2 text-base text-gray-600 dark:text-gray-400">
							یک چنل یوتیوب در تنظیمات اضافه کنید
						</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default App
