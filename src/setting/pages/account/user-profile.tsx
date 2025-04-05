import { FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../../context/auth.context'

export const UserProfile = () => {
	const { user, logout } = useAuth()

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
			</div>

			<div className="p-4 mb-6 rounded-lg bg-gray-50 dark:bg-gray-800">
				{user.connections && user.connections.length > 0 && (
					<div className="pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
						<p className="text-sm text-gray-500 dark:text-gray-400">اتصال‌ها</p>
						<div className="flex gap-2 mt-2">
							{user.connections.map((connection) => (
								<span
									key={connection}
									className="px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
								>
									{connection}
								</span>
							))}
						</div>
					</div>
				)}
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
