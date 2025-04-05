import { useState } from 'react'
import { TextInput } from '../../../components/text-input'
import { useAuth } from '../../../context/auth.context'
import {
	useSignIn,
	useSignUp,
} from '../../../services/getMethodHooks/auth/authService.hook'

export const AuthForm = () => {
	const [isLogin, setIsLogin] = useState(true)
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)

	const { login } = useAuth()
	const signInMutation = useSignIn()
	const signUpMutation = useSignUp()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		try {
			if (isLogin) {
				const response = await signInMutation.mutateAsync({ email, password })
				login(response.data)
			} else {
				const response = await signUpMutation.mutateAsync({
					name,
					password,
					email,
				})
				login(response.data)
			}
		} catch (err) {
			setError('خطا در احراز هویت. لطفاً دوباره تلاش کنید.')
			console.error(err)
		}
	}

	return (
		<div className="flex flex-col justify-center max-w-md mx-auto">
			<h2 className="mb-5 text-xl font-medium text-center text-gray-700 dark:text-gray-300">
				{isLogin ? 'ورود به حساب کاربری' : 'ایجاد حساب کاربری جدید'}
			</h2>

			{error && (
				<div className="p-3 mb-6 text-sm text-white bg-red-500 rounded-lg dark:bg-red-600">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="w-full space-y-5">
				{!isLogin && (
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-400 opacity-85">
							نام و نام خانوادگی
						</label>
						<TextInput
							id="name"
							type="text"
							value={name}
							onChange={setName}
							placeholder="نام و نام خانوادگی شما"
							disabled={signInMutation.isPending || signUpMutation.isPending}
						/>
					</div>
				)}

				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-400 opacity-85">
						ایمیل
					</label>
					<TextInput
						direction="ltr"
						id="email"
						type="email"
						value={email}
						onChange={setEmail}
						placeholder="example@email.com"
						disabled={signInMutation.isPending || signUpMutation.isPending}
					/>
				</div>

				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-400 opacity-85">
						رمز عبور
					</label>
					<TextInput
						direction="ltr"
						id="password"
						type="password"
						value={password}
						onChange={setPassword}
						placeholder="••••••••"
						disabled={signInMutation.isPending || signUpMutation.isPending}
					/>
				</div>

				<button
					type="submit"
					className="w-full py-3 mt-6 text-white transition-all duration-200 bg-blue-600 cursor-pointer rounded-xl hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
					disabled={signInMutation.isPending || signUpMutation.isPending}
				>
					{signInMutation.isPending || signUpMutation.isPending
						? 'درحال پردازش...'
						: isLogin
							? 'ورود به حساب'
							: 'ایجاد حساب جدید'}
				</button>
			</form>

			<button
				onClick={() => setIsLogin(!isLogin)}
				className="mt-3 text-sm font-light text-blue-600 transition-colors cursor-pointer hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
			>
				{isLogin
					? 'حساب کاربری ندارید؟ همین حالا ثبت نام کنید'
					: 'قبلاً ثبت نام کرده‌اید؟ وارد شوید'}
			</button>
		</div>
	)
}
