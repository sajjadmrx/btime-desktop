import { useAuth } from '../../../context/auth.context'
import { AuthForm } from './auth-form'
import { UserProfile } from './user-profile'

export const AccountSetting = () => {
	const { isAuthenticated, isLoadingUser } = useAuth()

	return (
		<div className="p-4 h-96 overflow-y-auto not-moveable font-[Vazir] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
			{isLoadingUser ? (
				<div className="flex items-center justify-center h-64 bg-red-400">
					در حال بارگذاری...
				</div>
			) : isAuthenticated ? (
				<UserProfile />
			) : (
				<AuthForm />
			)}
		</div>
	)
}
