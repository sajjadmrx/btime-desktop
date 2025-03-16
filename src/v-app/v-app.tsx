import { useCallback, useEffect, useState } from 'react'
import { MdOutlineDragIndicator } from 'react-icons/md'

interface AppItem {
	id: string
	name: string
	path: string
	icon?: string
}

function App() {
	const [apps, setApps] = useState<AppItem[]>([])
	const [isDragging, setIsDragging] = useState(false)
	const [isTransparent, setIsTransparent] = useState(false)

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

	return (
		<div
			className={`w-screen h-screen flex flex-col p-4 overflow-hidden ${
				isDragging
					? 'bg-blue-50 dark:bg-slate-800'
					: 'bg-gray-50 dark:bg-slate-900'
			}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<div className="absolute top-0 left-0 right-0 z-50 flex justify-end p-2">
				<div
					className="flex items-center transition-all duration-300 ease-in-out overflow-clip"
					dir="rtl"
				>
					<button
						className={`w-7 h-7  moveable flex justify-center items-center rounded-full 
                          hover:text-gray-300 dark:hover:bg-[#3c3c3c8a] dark:text-gray-400/90
                            dark:bg-transparent
                            ${isTransparent ? 'text-gray-300' : 'text-gray-500'} 
                        `}
						style={{ backdropFilter: 'blur(20px)' }}
					>
						<MdOutlineDragIndicator />
					</button>
				</div>
			</div>

			<div
				className={
					'flex flex-wrap items-center w-full h-64 gap-1  py-5 overflow-y-scroll divide-y scrollbar-thin  dark:divide-gray-300/20 divide-gray-300/20 sm:justify-center xxs:justify-center'
				}
			>
				{apps.map((app) => (
					<div
						key={app.id}
						className="relative flex flex-col items-center transition-all group w-[60px] sm:w-[75px] md:w-[90px]"
					>
						<div
							className="absolute z-10 flex items-center justify-center w-5 h-5 text-white transition-opacity bg-red-500 rounded-full opacity-0 cursor-pointer -top-1 -right-1 group-hover:opacity-100 hover:opacity-100 hover:bg-red-600"
							onClick={(e) => {
								e.stopPropagation()
								handleRemoveApp(app.id)
							}}
						>
							×
						</div>

						{/* دایره آیکن برنامه */}
						<div
							className="relative w-12 h-12 mb-2 transition-transform rounded-full cursor-pointer sm:w-16 sm:h-16 hover:scale-110 group-hover:ring-2 group-hover:ring-blue-400 dark:group-hover:ring-blue-500"
							onClick={() => handleLaunchApp(app)}
						>
							{app.icon ? (
								<img
									src={app.icon}
									alt={app.name}
									className="object-cover w-full h-full p-1 rounded-full"
									onError={(e) => {
										e.currentTarget.style.display = 'none'
										const defaultIcon = document.createElement('div')
										defaultIcon.className =
											'flex items-center justify-center w-full h-full text-3xl font-medium text-white rounded-full bg-gradient-to-br from-purple-500 to-indigo-600'
										defaultIcon.textContent = app.name.charAt(0).toUpperCase()
										e.currentTarget.parentNode.appendChild(defaultIcon)
									}}
								/>
							) : (
								<div className="flex items-center justify-center w-full h-full text-2xl font-medium text-white rounded-full sm:text-3xl bg-gradient-to-br from-purple-500 to-indigo-600">
									{app.name.charAt(0).toUpperCase()}
								</div>
							)}
						</div>

						<span className="w-full text-xs font-medium text-center truncate dark:text-white xs:text-xs sm:text-[12px]">
							{app.name}
						</span>
					</div>
				))}

				<div className="relative flex flex-col items-center w-[60px] sm:w-[75px] md:w-[90px]">
					<div className="flex items-center justify-center w-12 h-12 mb-2 transition-all border-2 border-gray-300 border-dashed rounded-full cursor-pointer sm:w-16 sm:h-16 hover:border-blue-400 hover:scale-105 dark:border-gray-600 dark:hover:border-blue-500">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="currentColor"
							className="text-gray-400 dark:text-gray-500"
							viewBox="0 0 16 16"
						>
							<path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
						</svg>
					</div>
					<span className="w-full text-xs text-center text-gray-500 dark:text-gray-400">
						--
					</span>
				</div>
			</div>

			{isDragging && (
				<div className="fixed top-0 left-0 flex items-center justify-center w-full h-full pointer-events-none">
					<div className="p-6 text-xl font-bold text-blue-600 bg-blue-100 border-2 border-blue-300 rounded-lg dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700">
						برای افزودن، فایل را رها کنید
					</div>
				</div>
			)}
		</div>
	)
}

export default App
