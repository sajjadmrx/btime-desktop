// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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
import {
	HiBanknotes,
	HiCalendar,
	HiClock,
	HiCog6Tooth,
	HiCurrencyDollar,
	HiSun,
	HiUserGroup,
} from 'react-icons/hi2'
import { TbAppsFilled, TbMessageCircle } from 'react-icons/tb'
import UpdateModal from './components/updateModal'
import { AboutUs } from './pages/about-us/aboutUs'
import { ArzChandSetting } from './pages/arzChand/arzChand.setting'
import { BtimeSetting } from './pages/btime/btime.setting'
import { ClockSetting } from './pages/clock/clock.setting'
import { DamDastiSetting } from './pages/dam_dasti/dam_dasti.setting'
import { NerkhYabSetting } from './pages/nerkhyab/nerkhYab.setting'
import { AppSetting } from './pages/setting/app.setting'
import { SubShomaarSetting } from './pages/sub-shomaar/sub-shomaar.setting'
import { WeatherSetting } from './pages/weather/weather.setting'

const queryClient = new QueryClient()

// Extract tab data to a separate constant
const TAB_DATA = [
	{
		label: 'ویجت تاریخ',
		value: 'btime',
		icon: <HiCalendar className="size-5" />,
		element: <BtimeSetting />,
	},
	{
		label: 'ویجت نرخ یاب',
		value: 'currency',
		icon: <HiCurrencyDollar className="size-5" />,
		element: <NerkhYabSetting />,
	},
	{
		label: 'ویجت ارز چند؟',
		value: 'arzChand',
		icon: <HiBanknotes className="size-5" />,
		element: <ArzChandSetting />,
	},
	{
		label: 'ویجت آب و هوا',
		value: 'weather',
		icon: <HiSun className="size-5" />,
		element: <WeatherSetting />,
	},
	{
		label: 'ویجت ساعت',
		value: 'clock',
		icon: <HiClock className="size-5" />,
		element: <ClockSetting />,
	},
	{
		label: 'ویجت دم‌دستی',
		value: 'damDasti',
		icon: <TbAppsFilled className="size-5" />,
		element: <DamDastiSetting />,
	},
	{
		label: 'ساب‌شمار',
		value: 'subShomaar',
		icon: <TbMessageCircle className="size-5" />,
		element: <SubShomaarSetting />,
	},
	{
		label: 'تنظیمات کلی',
		value: 'setting',
		icon: <HiCog6Tooth className="size-5" />,
		element: <AppSetting />,
	},
	{
		label: 'درباره ما',
		value: 'about',
		icon: <HiUserGroup className="size-5" />,
		element: <AboutUs />,
	},
]

// Custom Tab Item component for better icon alignment
const TabItem = ({ icon, label }) => (
	<div className="flex flex-col items-center justify-center">
		<div className="mb-1.5 text-center dark:text-gray-400  text-gray-600">
			{icon}
		</div>
		<Typography className="font-[Vazir] font-normal text-xs dark:text-gray-400 text-gray-600 text-center">
			{label}
		</Typography>
	</div>
)

function App() {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const handleColorSchemeChange = (e) => {
			document.documentElement.classList.remove('dark')
			if (e.matches) {
				document.documentElement.classList.add('dark')
			}
		}

		window.electronAPI.onUpdateDetails(() => {
			setOpen(true)
		})

		const colorSchemeMediaQuery = window.matchMedia(
			'(prefers-color-scheme: dark)',
		)
		handleColorSchemeChange(colorSchemeMediaQuery)

		colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)

		return () => {
			colorSchemeMediaQuery.removeEventListener(
				'change',
				handleColorSchemeChange,
			)
		}
	}, [])

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
					<div className="flex flex-row h-screen pb-5" dir="rtl">
						<Tabs value="btime" orientation="vertical">
							<TabsHeader
								className="w-36 not-moveable dark:bg-[#1d1d1d5b] rounded-none bg-white py-5 overflow-y-auto max-h-[calc(100vh-7px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
								indicatorProps={{
									className: 'bg-white dark:bg-[#1d1d1d]',
								}}
							>
								{TAB_DATA.map(({ label, value, icon }) => (
									<Tab
										key={value}
										value={value}
										className="hover:bg-gray-100 transition-colors duration-200 rounded dark:hover:bg-[#1d1d1d] py-3"
									>
										<TabItem icon={icon} label={label} />
									</Tab>
								))}
							</TabsHeader>
							<TabsBody className="w-screen">
								{TAB_DATA.map(({ value, element }) => (
									<TabPanel key={value} value={value} className="h-screen">
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
