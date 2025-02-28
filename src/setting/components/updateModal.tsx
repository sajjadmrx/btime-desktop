import React from 'react'

const EmojiWithText = ({ emoji, text }) => (
	<li className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
		<span className="text-gray-600 dark:text-white">{text}</span>
		<span className="text-2xl">{emoji}</span>
	</li>
)

const Button = ({ primary, children, onClick }) => (
	<button
		onClick={onClick}
		className={`w-full ${primary ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} text-white font-bold py-2 px-4 rounded`}
	>
		{children}
	</button>
)

const UpdateList = ({ date, version, updates, last }) => (
	<div className="relative p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
		{last && (
			<div className="absolute right-0 px-2 py-1 text-white bg-green-500 rounded-tr-lg rounded-bl-lg top-3"></div>
		)}
		<p
			className="mb-2 font-bold text-right text-gray-700 dark:text-white"
			dir="rtl"
		>
			(نسخه {version}) {date}
		</p>
		<ul className="space-y-2 text-right">
			{updates.map((update, index) => (
				<EmojiWithText key={index} emoji={update.emoji} text={update.text} />
			))}
		</ul>
	</div>
)

const UpdateModal = ({ onClick }) => {
	interface Update {
		date: string
		version: string //import.meta.env.PACKAGE_VERSION,
		last: boolean
		changes: {
			emoji: string
			text: string
		}[]
	}
	const updateDetails: Update[] = [
		{
			date: '1403/12/11',
			last: true,
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
			date: '1403/11/08',
			last: true,
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
			date: '1403/09/16',
			last: false,
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
			date: '1403/07/20',
			last: false,
			version: '1.4.4',
			changes: [
				{
					text: 'رفع مشکل شفافیت ویجت ها',
					emoji: '🐛',
				},
			],
		},
		{
			date: '1403/07/20',
			last: false,
			version: '1.4.3',
			changes: [
				{
					text: 'رفع مشکل  border radius در ویجت ها',
					emoji: '🐛',
				},
			],
		},

		{
			date: '1403/07/20',
			last: false,
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
			date: '1403/07/06',
			last: false,
			version: '1.4.1',
			changes: [
				{
					emoji: '🕘',
					text: 'اضافه شدن ساعت آنالوگ',
				},
			],
		},
		{
			date: '1403/06/29',
			last: false,
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
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
			<div className="w-full h-full max-w-md p-6 space-y-4 bg-white rounded-lg dark:bg-gray-800 overflow-y-clip">
				<div className="flex items-center justify-center space-x-2 text-blue-400">
					<span className="text-3xl">🎉</span>
					<h2 className="text-xl font-bold">بروز رسانی جدید نصب شد</h2>
				</div>
				<div
					className="dark:bg-gray-700 bg-gray-100
         rounded-lg p-4 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600"
				>
					{updateDetails.map((update, index) => (
						<UpdateList
							key={index}
							date={update.date}
							version={update.version}
							updates={update.changes}
							last={update.last}
						/>
					))}
				</div>
				<div className="space-y-2">
					<Button primary={false} onClick={onClick}>
						باشه
					</Button>
				</div>
			</div>
		</div>
	)
}

export default UpdateModal
