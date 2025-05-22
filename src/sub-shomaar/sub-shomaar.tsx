import ms from 'ms'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { widgetKey } from '../../shared/widgetKey'
import { useGetYoutubeProfile } from '../api/hooks/channel/youtube-profile.hook'
import { CountUpAnimation } from '../hooks/useCountAnimation'
import { formatSubscribeCount } from '../utils/format'

const useDarkMode = () => {
	const handleColorSchemeChange = useCallback(
		(e: MediaQueryListEvent | MediaQueryList) => {
			document.documentElement.classList.remove('dark')
			if (e.matches) {
				document.documentElement.classList.add('dark')
			}
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

function App() {
	const [channelName, setChannelName] = useState<string>('')
	const [subscriberFormat, setSubscriberFormat] = useState<'short' | 'full'>(
		'short',
	)

	useDarkMode()

	useEffect(() => {
		function handleSettingsUpdate() {
			const subShomaarSettings = window.store.get(widgetKey.SubShomaar)

			if (subShomaarSettings?.channelName) {
				setChannelName(subShomaarSettings.channelName)
			}
			setSubscriberFormat(subShomaarSettings?.subscriberFormat || 'short')
		}

		window.ipcRenderer.on('updated-setting', handleSettingsUpdate)
		handleSettingsUpdate()
		return () => {
			window.ipcRenderer.removeAllListeners('updated-setting')
		}
	}, [])

	const { data: channelInfo, isLoading } = useGetYoutubeProfile(
		channelName,
		!!channelName,
		ms('3m'),
	)

	const formattedSubscriberCount = useMemo(() => {
		if (!channelInfo?.isValid) return ''
		return subscriberFormat === 'short' ? (
			formatSubscribeCount(channelInfo.subscribers)
		) : (
			<CountUpAnimation end={channelInfo.subscribers} duration={1500} />
		)
	}, [subscriberFormat, channelInfo?.subscribers, channelInfo?.isValid])

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
							<div className="overflow-hidden border-gray-200 rounded-full shadow-md xxs:w-5 xxs:h-5 xs:w-14 xs:h-14 sm:w-20 sm:h-20 w-28 h-28">
								<img
									src={channelInfo.profile}
									alt={channelInfo.name}
									className="object-cover w-full h-full"
									loading="eager"
								/>
							</div>
						)}
						<h1
							className={`text-xl font-medium text-center 'text-gray-800 dark:text-gray-100/80`}
						>
							{channelInfo.name}
						</h1>
						<div className="flex flex-col items-center">
							<span
								className={
									'text-3xl font-semibold font-[balooTamma] xxs:text-sm xs:text-lg sm:text-xl text-gray-800 dark:text-gray-200/80'
								}
							>
								{formattedSubscriberCount}
							</span>
							<span
								className={`mt-1 text-base font-light text-[12px] xxs:text-xs 'text-gray-800 dark:text-gray-100/80 opacity-90`}
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
