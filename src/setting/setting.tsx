import {
	Tab,
	TabPanel,
	Tabs,
	TabsBody,
	TabsHeader,
	Typography,
} from '@material-tailwind/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { CgProfile } from 'react-icons/cg'
import {
	HiBanknotes,
	HiCalendar,
	HiClock,
	HiCog6Tooth,
	HiCurrencyDollar,
	HiSun,
	HiUser,
	HiUserGroup,
} from 'react-icons/hi2'
import { TbAppsFilled } from 'react-icons/tb'
import { AuthProvider } from '../context/auth.context'
import { useThemeMode } from '../hooks/useTheme'
import UpdateModal from './components/updateModal'
import { AboutUs } from './pages/about-us/aboutUs'
import { AccountSetting } from './pages/account/account.setting'
import { ArzChandSetting } from './pages/arzChand/arzChand.setting'
import { BtimeSetting } from './pages/btime/btime.setting'
import { ClockSetting } from './pages/clock/clock.setting'
import { DamDastiSetting } from './pages/dam_dasti/dam_dasti.setting'
import { NerkhYabSetting } from './pages/nerkhyab/nerkhYab.setting'
import { AppSetting } from './pages/setting/app.setting'
import { SubShomaarSetting } from './pages/sub-shomaar/sub-shomaar.setting'
import { WeatherSetting } from './pages/weather/weather.setting'

const queryClient = new QueryClient()

const TAB_DATA = [
	{
		label: 'تاریخ',
		value: 'btime',
		icon: <HiCalendar className="size-5" />,
		element: <BtimeSetting />,
		category: 'widgets',
	},
	{
		label: 'نرخ یاب',
		value: 'currency',
		icon: <HiCurrencyDollar className="size-5" />,
		element: <NerkhYabSetting />,
		category: 'widgets',
	},
	{
		label: 'ارز چند؟',
		value: 'arzChand',
		icon: <HiBanknotes className="size-5" />,
		element: <ArzChandSetting />,
		category: 'widgets',
	},
	{
		label: 'آب و هوا',
		value: 'weather',
		icon: <HiSun className="size-5" />,
		element: <WeatherSetting />,
		category: 'widgets',
	},
	{
		label: 'ساعت',
		value: 'clock',
		icon: <HiClock className="size-5" />,
		element: (
			<AuthProvider>
				<ClockSetting />
			</AuthProvider>
		),
		category: 'widgets',
	},
	{
		label: 'دم‌دستی',
		value: 'damDasti',
		icon: <TbAppsFilled className="size-5" />,
		element: <DamDastiSetting />,
		category: 'widgets',
	},
	{
		label: 'ساب‌شمار',
		value: 'subShomaar',
		icon: <CgProfile className="size-5" />,
		element: <SubShomaarSetting />,
		category: 'widgets',
	},
	{
		label: 'حساب کاربری',
		value: 'account',
		icon: <HiUser className="size-5" />,
		element: <AccountSetting />,
		category: 'app',
	},
	{
		label: 'تنظیمات',
		value: 'setting',
		icon: <HiCog6Tooth className="size-5" />,
		element: <AppSetting />,
		category: 'app',
	},
	{
		label: 'درباره ما',
		value: 'about',
		icon: <HiUserGroup className="size-5" />,
		element: <AboutUs />,
		category: 'app',
	},
]

const TabItem = ({ icon, label }) => (
	<div className="flex items-center justify-start w-full gap-2">
		<div className="text-gray-600 dark:text-gray-400">{icon}</div>
		<Typography className="font-[Vazir] font-normal text-sm dark:text-gray-400 text-gray-600 text-right">
			{label}
		</Typography>
	</div>
)

function App() {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		window.electronAPI.onUpdateDetails(() => {
			setOpen(true)
		})

		window.addEventListener('open-setting', (event: any) => {
			const page = event.detail.page
			const tab = TAB_DATA.find((tab) => tab.value === page)
			if (tab) {
				//@ts-ignore
				document.querySelector(`[data-value="${tab.value}"]`).click()
			}
		})
	}, [])

	useThemeMode()

	const closeUpdateModal = () => setOpen(false)
	const onExitButtonClick = () => window.close()

	return (
		<>
			<QueryClientProvider client={queryClient}>
				<div className="w-screen h-screen overflow-hidden moveable">
					<div className="w-full h-7 flex dark:bg-[#14141495] bg-white/65">
						<button
							className="w-7 h-7 ml-5 flex items-center not-moveable group justify-center hover:bg-red-400 dark:hover:bg-[#b94a4aad] transition-colors duration-200 rounded"
							onClick={onExitButtonClick}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-4 dark:text-[#9d9d9d] text-gray-600 group-hover:text-gray-100"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
					<div className="flex flex-row h-screen" dir="rtl">
						<Tabs value="btime" orientation="vertical">
							<TabsHeader
								className="w-44 not-moveable dark:bg-[#1d1d1d5b] rounded-none bg-white pb-10 overflow-y-auto max-h-[calc(100vh-7px)] custom-scrollbar"
								indicatorProps={{
									className: 'bg-white dark:bg-[#1d1d1d]',
								}}
							>
								<div className="px-3 mb-2">
									<Typography className="mb-1  font-[Vazir] text-xs font-semibold text-gray-500 dark:text-gray-400">
										ویجت ها
									</Typography>
									<div className="h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
								</div>

								{TAB_DATA.filter((tab) => tab.category === 'widgets').map(
									({ label, value, icon }) => (
										<Tab
											key={value}
											value={value}
											className="hover:bg-gray-100 transition-colors duration-200 rounded dark:hover:bg-[#1d1d1d] py-2 px-3 flex justify-start"
										>
											<TabItem icon={icon} label={label} />
										</Tab>
									),
								)}

								<div className="px-3 mt-4 mb-2">
									<Typography className="mb-1 font-[Vazir] text-xs font-semibold text-gray-500 dark:text-gray-400">
										برنامه
									</Typography>
									<div className="h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
								</div>

								{TAB_DATA.filter((tab) => tab.category === 'app').map(
									({ label, value, icon }) => (
										<Tab
											key={value}
											value={value}
											className="hover:bg-gray-100 transition-colors duration-200 rounded dark:hover:bg-[#1d1d1d] py-2 px-3 flex justify-start"
										>
											<TabItem icon={icon} label={label} />
										</Tab>
									),
								)}
							</TabsHeader>
							<TabsBody className="w-screen">
								{TAB_DATA.map(({ value, element }) => (
									<TabPanel
										key={value}
										value={value}
										className="h-screen pb-10"
									>
										{element}
									</TabPanel>
								))}
							</TabsBody>
						</Tabs>
					</div>
					{open && <UpdateModal onClick={closeUpdateModal} />}
				</div>
			</QueryClientProvider>
		</>
	)
}

export default App
