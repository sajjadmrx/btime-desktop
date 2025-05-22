import { useCallback, useEffect, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { MdOutlineDragIndicator } from 'react-icons/md'
import { RiDeleteBinLine } from 'react-icons/ri'
import { userLogger } from '../../shared/logger'

interface AppItem {
	id: string
	name: string
	path: string
	icon?: string
}

function App() {
	const [apps, setApps] = useState<AppItem[]>([])
	const [isDragging, setIsDragging] = useState(false)

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

		colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)

		return () => {
			colorSchemeMediaQuery.removeEventListener(
				'change',
				handleColorSchemeChange,
			)
		}
	}, [])

	useEffect(() => {
		window.ipcMain.invoke('get-apps').then((savedApps: AppItem[]) => {
			if (savedApps) setApps(savedApps)
		})
	}, [])

	useEffect(() => {
		if (apps.length > 0) {
			window.ipcMain.invoke('save-apps', apps)
		}
	}, [apps])

	const handleLaunchApp = useCallback((app: AppItem) => {
		window.ipcMain.invoke('launch-app', app.path)
	}, [])

	const handleRemoveApp = useCallback((id: string) => {
		setApps((prevApps) => prevApps.filter((app) => app.id !== id))
	}, [])

	const handleAddApp = useCallback(async () => {
		try {
			const result = await window.ipcMain.invoke('open-file-dialog')

			if (result?.filePaths && result.filePaths.length > 0) {
				const filePath = result.filePaths[0]
				const appInfo = await window.ipcMain.invoke('get-app-info', filePath)

				if (appInfo) {
					setApps((prevApps) => [
						...prevApps,
						{
							id: Date.now().toString(),
							name: appInfo.name,
							path: filePath,
							icon: appInfo.icon,
						},
					])
				}
			}
		} catch (error) {
			userLogger.error('Error adding app:', error)
		}
	}, [])

	const handleDragOver = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			if (!isDragging) setIsDragging(true)
		},
		[isDragging],
	)

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
	}, [])

	const handleDrop = useCallback(async (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)

		const files = Array.from(e.dataTransfer.files)
		if (files.length > 0) {
			for (const file of files) {
				const appInfo = await window.ipcMain.invoke('get-app-info', file.path)
				if (appInfo) {
					setApps((prevApps) => [
						...prevApps,
						{
							id: Date.now().toString(),
							name: appInfo.name,
							path: file.path,
							icon: appInfo.icon,
						},
					])
				}
			}
		}
	}, [])

	const iconButtonStyle =
		'text-gray-500 dark:text-gray-400/90 hover:bg-gray-200/70 dark:hover:bg-[#3c3c3c8a]'

	return (
		<div
			className={
				'w-screen h-screen flex flex-col p-2 overflow-hidden transition-colors duration-300'
			}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<div className="absolute top-0 left-0 right-0 z-50 flex justify-end p-2">
				<div className="flex items-center">
					<button
						className={`w-8 h-8 moveable flex justify-center items-center rounded-full transition-colors ${iconButtonStyle}`}
						style={{ backdropFilter: 'blur(20px)' }}
						title="جابجایی"
					>
						<MdOutlineDragIndicator size={18} />
					</button>
				</div>
			</div>

			<div
				className={
					'flex flex-wrap items-start justify-center w-full mt-3 h-full gap-4 py-4 px-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent'
				}
			>
				{apps.map((app) => (
					<div
						key={app.id}
						className="relative  flex flex-col items-center transition-all group w-[60px] xxs:w-[45px] xs:w-[55px]  sm:w-[55px] md:w-[85px] "
					>
						<button
							className="absolute z-10 flex items-center justify-center w-5 h-5 text-white transition-all bg-red-500 rounded-full opacity-0 cursor-pointer -top-1 -right-1 group-hover:opacity-100 hover:scale-110 hover:bg-red-600"
							onClick={(e) => {
								e.stopPropagation()
								handleRemoveApp(app.id)
							}}
							title="حذف برنامه"
						>
							<RiDeleteBinLine size={12} />
						</button>

						<div
							className={`relative mb-2 transition-all rounded-full shadow-md cursor-pointer w-12 h-12 xs:w-12 xs:h-12 sm:w-10 sm:h-10 hover:scale-110  xxs:w-8 xxs:h-8 
                                group-hover:ring-2 group-hover:ring-blue-400 dark:group-hover:ring-blue-500`}
							onClick={() => handleLaunchApp(app)}
							title={`اجرای ${app.name}`}
						>
							{app.icon ? (
								<img
									src={app.icon}
									alt={app.name}
									className={'object-cover w-full h-full p-1 rounded-full'}
									onError={(e) => {
										e.currentTarget.style.display = 'none'
										const defaultIcon = document.createElement('div')
										defaultIcon.className =
											'flex items-center justify-center w-full h-full text-xl font-medium text-white rounded-full xs:text-2xl sm:text-3xl bg-gradient-to-br from-purple-500 to-indigo-600'
										defaultIcon.textContent = app.name.charAt(0).toUpperCase()
										e.currentTarget.parentNode.appendChild(defaultIcon)
									}}
								/>
							) : (
								<div className="flex items-center justify-center w-full h-full text-xl font-medium text-white rounded-full sm:text-xs bg-gradient-to-br from-purple-500 to-indigo-600">
									{app.name.charAt(0).toUpperCase()}
								</div>
							)}
						</div>

						<span
							className={
								'w-full px-1 text-xs xxs:text-[10px] sm:text-xs font-medium text-center truncate text-gray-600 dark:text-gray-300'
							}
						>
							{app.name.charAt(0).toUpperCase() + app.name.slice(1)}
						</span>
					</div>
				))}

				<div className="relative flex flex-col items-center w-[60px] xs:w-[65px] sm:w-[75px] md:w-[85px]">
					<div
						className={`flex items-center justify-center mb-2 transition-all border-2 border-gray-400/30 border-dashed rounded-full cursor-pointer w-12 h-12 xs:w-13 xs:h-13 sm:w-14 sm:h-14 
                        hover:border-blue-400 hover:scale-105 dark:hover:border-blue-500 
                        hover:bg-blue-50 dark:hover:bg-blue-900/30 group`}
						title="افزودن برنامه جدید"
						onClick={handleAddApp}
					>
						<IoMdAdd
							size={20}
							className={`text-gray-400
                                transition-colors dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400`}
						/>
					</div>
				</div>
			</div>

			{isDragging && (
				<div className="fixed top-0 left-0 flex items-center justify-center w-full h-full pointer-events-none bg-black/5 dark:bg-black/20">
					<div className="p-8 text-xl font-bold text-blue-600 border-2 border-blue-300 rounded-lg shadow-lg bg-blue-100/90 dark:bg-blue-900/90 dark:text-blue-200 dark:border-blue-700 backdrop-blur-sm">
						<div className="flex items-center gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-8 h-8 animate-bounce"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 14l-7 7m0 0l-7-7m7 7V3"
								/>
							</svg>
							<span>برای افزودن، فایل را رها کنید</span>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default App
