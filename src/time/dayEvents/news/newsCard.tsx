export function NewsCard({ news }) {
	return (
		<div className="px-2 py-1">
			<div className={'mt-2 mb-1 flex items-center'}>
				<div
					className="flex-grow flex items-center gap-2"
					onClick={() => news.url && window.ipcMain.openUrl(news.url)}
					dir="rtl"
				>
					{news.icon && (
						<img className="w-4 h-4 rounded-lg" src={news.icon} alt="icon" />
					)}
					<p
						className={`text-sm font-light text-gray-trasnparent 
                          ${news.url ? 'cursor-pointer dark:text-blue-500 text-blue-800/80 decoration-solid' : 'text-gray-700 dark:text-gray-300'}
                        `}
					>
						{news.title}
					</p>
				</div>
			</div>
		</div>
	)
}
