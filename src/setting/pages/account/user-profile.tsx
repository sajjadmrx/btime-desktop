import { FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../../context/auth.context'

const platforms = [
	{
		id: 'google',
		name: 'گوگل (تقویم و ...)',
		connected: false,
		description: 'اتصال به تقویم گوگل و سایر خدمات',
		bgColor: 'bg-red-500',
		isActive: true,
		isLoading: false,
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="white"
			>
				<path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
			</svg>
		),
	},
	{
		id: 'github',
		name: 'گیت‌هاب',
		connected: false,
		bgColor: 'bg-black',
		isActive: false,
		isLoading: false,
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="white"
			>
				<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
			</svg>
		),
	},
]

interface Platform {
	id: string
	name: string
	connected: boolean
	description?: string
	bgColor: string
	isActive: boolean
	isLoading: boolean
	icon: JSX.Element
}

export const UserProfile = () => {
	const { user, logout } = useAuth()

	if (user?.connections?.length) {
		for (const platform of platforms) {
			platform.connected = user.connections.includes(platform.id)
		}
	}

	if (!user) return null

	return (
		<div className="max-w-md mx-auto font-[Vazir]">
			<div className="mb-8 text-center">
				{user.avatar ? (
					<img
						src={user.avatar}
						alt={user.name}
						className="object-cover mx-auto mb-4 border-2 border-blue-100 rounded-full w-14 h-14 dark:border-blue-800"
					/>
				) : (
					<div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 text-2xl text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
						{user.name?.charAt(0) || '?'}
					</div>
				)}
				<h2 className="mb-1 text-xl font-medium text-gray-800 dark:text-white">
					{user.name}
				</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
				{user.username && (
					<p
						className="mt-1 text-xs text-gray-500 dark:text-gray-600"
						dir="ltr"
					>
						(@{user.username})
					</p>
				)}
			</div>

			<div className="p-4 mb-6 rounded-lg bg-gray-50 dark:bg-gray-800">
				<div className="pb-2 mb-2">
					<p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
						اتصال‌ها ({platforms.filter((p) => p.connected).length})
					</p>
					<div className="flex flex-wrap gap-3">
						{platforms.filter((p) => p.connected).length > 0 ? (
							platforms
								.filter((platform) => platform.connected)
								.map((platform) => (
									<div
										key={platform.id}
										className={`relative flex items-center justify-center p-2 rounded-lg ${platform.bgColor}`}
										title={platform.name}
									>
										{platform.icon}
										<div className="absolute top-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full dark:border-gray-800"></div>
									</div>
								))
						) : (
							<div className="p-2 text-sm text-gray-700 rounded-lg text-balance bg-yellow-50 dark:bg-yellow-700/30 dark:text-yellow-200">
								<p>
									جهت دسترسی به گوگل کلندر و سایر سرویس‌های مشابه، افزونه مرورگر
									ویجتی‌فای را نصب کرده و در بخش پروفایل به پلتفرم مورد نظر متصل
									شوید.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-col space-y-3">
				<button
					onClick={logout}
					className="flex items-center justify-center px-4 py-2 text-red-600 transition-colors bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
				>
					<FiLogOut className="ml-2" />
					<span>خروج از حساب کاربری</span>
				</button>
			</div>
		</div>
	)
}
