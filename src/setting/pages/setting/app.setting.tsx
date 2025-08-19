import { Checkbox, Typography } from '@material-tailwind/react'
import type { MainSettingStore, Theme } from 'electron/store'
import { useEffect, useState } from 'react'
import { ThemeComponent } from './theme.component'

export function AppSetting() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [theme, setTheme] = useState<Theme>('light')
	const [mainSetting, setMainSetting] = useState<MainSettingStore>(
		window.store.get('main'),
	)

	useEffect(() => {
		setMainSetting(window.store.get('main'))
		setTheme(mainSetting.theme)
	}, [])

	function setThemeValue(value: Theme) {
		window.ipcMain.changeTheme(value)
		setSettingValue('theme', value)
	}

	function setSettingValue<T extends keyof MainSettingStore>(
		key: T,
		value: MainSettingStore[T],
	) {
		mainSetting[key] = value
		setMainSetting({ ...mainSetting })
		applyChanges()
	}

	function applyChanges() {
		window.store.set('main', {
			...mainSetting,
		})
	}

	function resetSettings() {
		window.ipcMain.send('reset-setting')
	}

	function reopenApp() {
		window.ipcMain.send('reOpen')
	}

	const themes = [
		{
			theme: 'light',
			icon: 'sun.png',
			text: 'روشن',
		},
		{
			theme: 'dark',
			icon: 'moon.png',
			text: 'تیره',
		},
		{
			theme: 'system',
			icon: 'auto.png',
			text: 'خودکار',
		},
	]
	return (
		<>
			<div className="p-2 mt-2 h-full not-moveable font-[Vazir]">
				<div
					className="flex flex-col w-full gap-4 px-5 text-right not-moveable"
					dir="rtl"
				>
					<div>
						<h1 className="dark:text-[#c7c7c7] text-gray-600 text-base font-semibold font-[Vazir]">
							تم
						</h1>
						<div className="flex flex-row justify-around w-full h-20 gap-4 px-3 mt-2 duration-200">
							{themes.map((item, index) => (
								<ThemeComponent
									key={index}
									setThemeValue={setThemeValue}
									themeState={mainSetting.theme}
									theme={item.theme}
									text={item.text}
									icon={item.icon}
								/>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-2 mt-1">
						<Checkbox
							ripple={true}
							defaultChecked={mainSetting.moveable}
							onClick={() => setSettingValue('moveable', !mainSetting.moveable)}
							label={
								<div>
									<Typography
										variant={'h5'}
										color="blue-gray"
										className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir] font-normal"
									>
										قابل جابجایی{' '}
										<span className="font-light">
											( مدیریت جابجایی ویجت ها - نیاز به راه اندازی مجدد برنامه)
										</span>
									</Typography>
								</div>
							}
							containerProps={{
								className: 'flex',
							}}
						/>

						<Checkbox
							ripple={true}
							defaultChecked={mainSetting.enableAnalytics}
							onClick={() =>
								setSettingValue('enableAnalytics', !mainSetting.enableAnalytics)
							}
							label={
								<div>
									<Typography
										variant={'h5'}
										color="blue-gray"
										className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir] font-normal"
									>
										فعالسازی آنالیتیک{' '}
										<span className="font-light">
											(با فعالسازی این گزینه اطلاعاتی از برنامه جهت بهبود و
											ارتقا برنامه ارسال می شود)
										</span>
									</Typography>
								</div>
							}
							containerProps={{
								className: 'flex',
							}}
						/>
					</div>

					<div className="flex flex-row gap-4 mt-4">
						<button
							className="flex items-center justify-center w-40 gap-2 p-2 text-xs text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
							onClick={reopenApp}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
								/>
							</svg>
							راه‌اندازی مجدد برنامه
						</button>

						<button
							className="flex items-center justify-center w-40 gap-2 p-2 text-xs text-white transition-colors bg-red-400 rounded-md hover:bg-red-500"
							onClick={resetSettings}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
								/>
							</svg>
							بازنشانی تنظیمات
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
