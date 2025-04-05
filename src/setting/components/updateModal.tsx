const EmojiWithText = ({ emoji, text }) => (
	<li className="flex items-center justify-end gap-2.5 py-1.5">
		<span className="text-sm leading-tight text-gray-700 dark:text-gray-200">
			{text}
		</span>
		<span className="text-xl min-w-[28px] flex justify-center">{emoji}</span>
	</li>
)

const Button = ({ primary = false, children, onClick }) => (
	<button
		onClick={onClick}
		className={`w-full transition-all duration-200 font-medium py-2.5 px-4 rounded-lg ${
			primary
				? 'bg-blue-500 hover:bg-blue-600 text-white'
				: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
		}`}
	>
		{children}
	</button>
)

const UpdateList = ({ version, updates, isNew }) => (
	<div className="relative p-4 mb-4 transition-all duration-200 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-md">
		{isNew && (
			<div className="absolute start-0 top-0 px-2.5 py-1 text-xs font-medium text-white bg-green-500 rounded-tr-none rounded-br-lg rounded-bl-none rounded-tl-lg">
				جدید
			</div>
		)}
		<p
			className="mb-3 font-bold text-right text-gray-800 dark:text-white"
			dir="rtl"
		>
			<span className="text-gray-500 dark:text-gray-400">نسخه {version}</span>
		</p>
		<ul className="pr-3 space-y-1 text-right border-r-2 border-gray-200 dark:border-gray-600">
			{updates.map((update, index) => (
				<EmojiWithText key={index} emoji={update.emoji} text={update.text} />
			))}
		</ul>
	</div>
)

const UpdateModal = ({ onClick }) => {
	interface Update {
		version: string
		changes: {
			emoji: string
			text: string
		}[]
	}

	const updateDetails: Update[] = [
		{
			version: '1.4.8',
			changes: [
				{
					text: 'اضافه شدن ویجت دم‌دستی',
					emoji: '🗃️',
				},
				{
					text: 'بهبود و طراحی مجدد ویجت ارزچند',
					emoji: '🎨',
				},
				{
					text: 'تغییر نام و ایکون برنامه به ویجتی‌فای',
					emoji: '👩‍🎨',
				},
				{
					text: 'بهبود قسمت درباره ما',
					emoji: '📄',
				},
				{
					text: 'بهبود رنگ ها در ویجت آب و هوا',
					emoji: '🌈',
				},
				{
					text: 'رفع مشکل عدم نمایش بک گراند در ویجت آب و هوا',
					emoji: '🐛',
				},
			],
		},
		{
			version: '1.4.7',
			changes: [
				{
					text: 'رفع مشکل تقویم',
					emoji: '🐛',
				},
				{
					text: 'رفع مشکل فعال/غیرفعال سازی ویجت ها',
					emoji: '🐛',
				},
				{
					text: 'رفع مشکل عدم نمایش ایکون در مک',
					emoji: '🐛',
				},
			],
		},
		{
			version: '1.4.6',
			changes: [
				{
					text: 'اضافه شدن قیمت طلا و سکه',
					emoji: '💰',
				},
				{
					text: 'بهبود نمایش قیمت ارزها',
					emoji: '⚒️',
				},
				{
					text: 'رفع مشکل تقویم',
					emoji: '🐛',
				},
			],
		},
		{
			version: '1.4.5',
			changes: [
				{
					text: 'اضافه شدن بدج "تعطیل" به ویجت تاریخ ( در سایز کوچک ))',
					emoji: '🎨',
				},
				{
					text: 'بهبود رنگ ها در وضعیت بدون بک گراند',
					emoji: '🌈',
				},
			],
		},
		{
			version: '1.4.4',
			changes: [
				{
					text: 'رفع مشکل شفافیت ویجت ها',
					emoji: '🐛',
				},
			],
		},
		{
			version: '1.4.3',
			changes: [
				{
					text: 'رفع مشکل  border radius در ویجت ها',
					emoji: '🐛',
				},
			],
		},
		{
			version: '1.4.2',
			changes: [
				{
					text: 'اضافه شدن قالب کلاسیک به ویجت ارزچند',
					emoji: '🎨',
				},
				{
					text: 'اضافه شدن امکان غیرفعال سازی پشت زمینه(بک گراند) ویجت ها',
					emoji: '🧱',
				},
				{
					text: 'اضافه شدن قابلیت بازنشانی تنظیمات به حالت اولیه',
					emoji: '🔄',
				},
				{
					text: 'اضافه شدن نمایشگر دقیقه به ساعت انالوگ',
					emoji: '🕒',
				},
				{
					text: 'بهبود انتخابگر ارزها در تنظیمات ویجت ارزچند',
					emoji: '⚙️',
				},
			],
		},
		{
			version: '1.4.1',
			changes: [
				{
					emoji: '🕘',
					text: 'اضافه شدن ساعت آنالوگ',
				},
			],
		},
		{
			version: '1.4.0',
			changes: [
				{
					emoji: '🕰️',
					text: 'اضافه شدن ساعت دیجیتال',
				},
				{
					emoji: '📝',
					text: 'اضافه شدن مناسبت های روز در ویجت تایم',
				},
				{
					emoji: '🗓️',
					text: 'اضافه شدن  امکان فعال/غیرفعال کردن تقویم سمت چپ ویجت',
				},
				{
					emoji: '⚙️',
					text: 'اضافه شدن امکان اعمال مستقیم تغییرات در تنظیمات ویجت ها',
				},
				{
					emoji: '↔️',
					text: 'اضافه شدن امکان مدیریت جابجایی ویجت ها (در تنظیمات کلی)',
				},
				{
					emoji: '🐛',
					text: 'رفع مشکل تشخیص روزهای تعطیل',
				},
				{
					emoji: '🐛',
					text: 'رفع چندین مشکل جزئی',
				},
			],
		},
	]

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-30">
			<div className="w-full max-w-lg p-6 overflow-hidden transition-all duration-300 transform shadow-xl bg-gray-50 dark:bg-gray-800 rounded-xl animate-slideUp">
				<div className="flex items-center justify-center space-x-2 text-blue-400">
					<span className="text-3xl">🎉</span>
					<h2 className="text-xl font-bold">بروز رسانی جدید نصب شد</h2>
				</div>

				<div className="dark:bg-gray-900/50 bg-gray-100/80 rounded-xl p-5 mt-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
					{updateDetails.map((update, index) => (
						<UpdateList
							key={index}
							version={update.version}
							updates={update.changes}
							isNew={index === 0}
						/>
					))}
				</div>

				<div className="flex gap-3 mt-6">
					<Button primary onClick={onClick}>
						متوجه شدم
					</Button>
				</div>
			</div>
		</div>
	)
}

export default UpdateModal
