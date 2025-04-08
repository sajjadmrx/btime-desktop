import { Button, Typography } from '@material-tailwind/react'
import { FiLock } from 'react-icons/fi'
import { useAuth } from '../context/auth.context'

interface NeedAuthMessageProps {
	widgetName: string
	widgetDescription?: string
	onLoginClick?: () => void
}

export function NeedAuthMessage({
	widgetName,
	widgetDescription,
	onLoginClick,
}: NeedAuthMessageProps) {
	const { isAuthenticated } = useAuth()

	if (isAuthenticated) {
		return null
	}

	const handleLoginClick = () => {
		if (onLoginClick) {
			onLoginClick()
		} else {
			const event = new CustomEvent('open-setting', {
				detail: { page: 'account' },
			})
			window.dispatchEvent(event)
		}
	}

	return (
		<div className="flex flex-col items-center justify-center p-4 mt-4 border-2 border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
			<div className="flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 rounded-full dark:bg-blue-900/30">
				<FiLock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
			</div>

			<Typography
				variant="h5"
				className="mb-2 text-center text-gray-800 dark:text-white font-[Vazir]"
			>
				نیاز به ورود به حساب کاربری
			</Typography>

			<Typography
				variant="paragraph"
				className="mb-4 text-center text-gray-600 dark:text-gray-400 font-[Vazir] text-sm"
			>
				{widgetDescription ||
					`برای استفاده از ویجت ${widgetName} نیاز به ورود به حساب کاربری دارید.`}
			</Typography>

			<Button
				color="blue"
				size="sm"
				className="flex items-center gap-2 font-[Vazir]"
				onClick={handleLoginClick}
			>
				<span>ورود به حساب کاربری</span>
			</Button>
		</div>
	)
}
