import { FaTelegram } from 'react-icons/fa6'

const FeatureItem = ({ emoji, text }) => (
	<div className="flex items-center gap-2 py-1.5">
		<span className="flex-shrink-0 text-xl">{emoji}</span>
		<span className="text-sm text-gray-700 dark:text-gray-200">{text}</span>
	</div>
)

const Button = ({ primary = false, children, onClick }) => (
	<button
		onClick={onClick}
		className={`flex-1 transition-all text-sm font-medium py-2 px-3 rounded-md ${
			primary
				? 'bg-blue-500 hover:bg-blue-600 text-white'
				: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
		}`}
	>
		{children}
	</button>
)

const UpdateModal = ({ onClick }) => {
	const latestUpdate = {
		version: 'درخشان',
		features: [
			{
				text: 'تغییر کلی در طراحی',
				emoji: '🎨',
			},
			{
				text: 'رفع مشکلات',
				emoji: '🐛',
			},
		],
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/30">
			<div className="w-full max-w-xs p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-slideUp">
				{/* Header */}
				<div className="flex flex-col items-center mb-3 text-center">
					<div className="p-2 mb-2 bg-blue-100 rounded-full dark:bg-blue-900/30">
						<span className="text-xl">🎉</span>
					</div>
					<h2 className="text-base font-bold text-gray-800 dark:text-white">
						نسخه جدید
					</h2>
					<div className="text-xs font-medium text-green-700 dark:text-green-300">
						{latestUpdate.version}
					</div>
				</div>

				{/* Features Section */}
				<div className="p-2 mb-4 rounded-md bg-gray-50 dark:bg-gray-700/50">
					<h3 className="mb-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300">
						ویژگی‌های جدید
					</h3>
					<div
						className="pr-1 space-y-1 overflow-y-auto rtl max-h-32 custom-scrollbar"
						dir="rtl"
					>
						{latestUpdate.features.map((feature, index) => (
							<FeatureItem
								key={index}
								emoji={feature.emoji}
								text={feature.text}
							/>
						))}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-2">
					<Button primary onClick={onClick}>
						متوجه شدم
					</Button>
					<Button
						onClick={() => window.ipcMain.openUrl('https://t.me/widgetify')}
					>
						<div className="flex items-center justify-center gap-1">
							<span>تلگرام</span>
							<FaTelegram size={14} />
						</div>
					</Button>
				</div>
			</div>
		</div>
	)
}

export default UpdateModal
