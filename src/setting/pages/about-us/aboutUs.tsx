import { useState } from 'react'
import { BiMessageRoundedDots } from 'react-icons/bi'
import { FaDonate } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'
import { FiExternalLink, FiGlobe } from 'react-icons/fi'

interface LinkButtonProps {
	icon: 'globe' | 'donate' | 'feedback' | 'github'
	title: string
	url: string
}

export function AboutUs() {
	return (
		<div className="p-2 h-96 flex flex-col justify-between not-moveable font-[Vazir] overflow-y-auto">
			<div className="flex flex-col space-y-6">
				<div className="flex flex-col space-y-3">
					<h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
						درباره ویجتیفای
					</h1>
					<p className="text-sm text-gray-600 dark:text-[#c7c7c7] text-center leading-relaxed">
						این برنامه با هدف ارائه ویجت های متنوع و کاربردی برای کاربران ایرانی
						طراحی شده است.
					</p>
					<div className="w-full my-1 border-b border-gray-200 dark:border-gray-700"></div>
				</div>

				<div className="flex flex-col space-y-4">
					<h2 className="text-lg font-bold text-gray-700 dark:text-[#e0e0e0] flex items-center">
						لینک های ما
					</h2>

					<div className="grid grid-cols-2 gap-3 sm:gap-4">
						<LinkButton
							icon="globe"
							title="وب‌سایت"
							url="https://widgetify.ir"
						/>
						<LinkButton
							icon="donate"
							title="حمایت مالی"
							url="https://widgetify.ir/donate"
						/>
						<LinkButton
							icon="feedback"
							title="ارسال بازخورد"
							url="https://feedback.onl/fa/b/widgetify"
						/>
						<LinkButton
							icon="github"
							title="گیت‌هاب"
							url="https://github.com/widgetify-app"
						/>
					</div>
				</div>
			</div>

			<div className="text-xs text-gray-600 dark:text-[#c7c7c7] flex items-center justify-center mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
				با تشکر از همه کسانی که تو این پروژه مشارکت دارند.{' '}
				<span className="mx-1 text-red-500">❤️</span> | نسخه{' '}
				{import.meta.env.PACKAGE_VERSION}
			</div>
		</div>
	)
}

function LinkButton({ icon, title, url }: LinkButtonProps) {
	const [isHovered, setIsHovered] = useState(false)

	const handleClick = () => window.ipcMain.openUrl(url)

	return (
		<button
			onClick={handleClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onFocus={() => setIsHovered(true)}
			onBlur={() => setIsHovered(false)}
			className="relative flex items-center p-3 transition-all duration-200 bg-gray-100 rounded-lg dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md group"
			aria-label={`${title} - لینک خارجی`}
		>
			<div className="flex items-center">
				{icon === 'globe' && <FiGlobe className="w-5 h-5 ml-2 text-blue-500" />}
				{icon === 'donate' && (
					<FaDonate className="w-5 h-5 ml-2 text-red-500" />
				)}
				{icon === 'feedback' && (
					<BiMessageRoundedDots className="w-5 h-5 ml-2 text-green-500" />
				)}
				{icon === 'github' && (
					<FaGithub className="w-5 h-5 ml-2 text-gray-700 dark:text-gray-300" />
				)}
				<span className="text-sm text-gray-700 dark:text-gray-200">
					{title}
				</span>
			</div>

			{isHovered && (
				<span className="absolute top-0 px-2 py-1 text-xs text-white transition-opacity duration-200 transform -translate-y-full bg-gray-800 rounded opacity-0 left-1 group-hover:opacity-100">
					{url}
				</span>
			)}

			<FiExternalLink className="absolute w-3 h-3 text-gray-400 bottom-1 left-1" />
		</button>
	)
}
