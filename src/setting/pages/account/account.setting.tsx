import { AiOutlineLoading } from 'react-icons/ai'
import { useAuth } from '../../../context/auth.context'
import { AuthForm } from './auth-form'
import { UserProfile } from './user-profile'

export const AccountSetting = () => {
	const { isAuthenticated, isLoadingUser } = useAuth()

	return (
		<div className="p-4 h-full overflow-y-auto not-moveable font-[Vazir] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-700">
			{isLoadingUser ? (
				<div className="flex items-center justify-center h-full gap-2 m-auto text-lg">
					<AiOutlineLoading className="w-5 h-5 ml-2 text-gray-500 animate-spin" />
				</div>
			) : isAuthenticated ? (
				<UserProfile />
			) : (
				<AuthForm />
			)}
		</div>
	)
}
