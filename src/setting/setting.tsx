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

import { useEffect } from 'react'
import { BtimeSetting } from './widgets/btime.setting'
import { NerkhYabSetting } from './widgets/nerkhYab.setting'
import { AppSetting } from './widgets/setting/app.setting'
import { ArzChandSetting } from './widgets/arzChand.setting'
import { WeatherSetting } from './widgets/weather/weather.setting'

function App() {
  useEffect(() => {
    const handleColorSchemeChange = (e) => {
      document.documentElement.classList.remove('dark')
      if (e.matches) {
        document.documentElement.classList.add('dark')
      }
    }

    const colorSchemeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    )
    handleColorSchemeChange(colorSchemeMediaQuery)

    colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)
    return () => {
      colorSchemeMediaQuery.removeEventListener(
        'change',
        handleColorSchemeChange
      )
    }
  }, [])

  const data = [
    {
      label: 'ویجت تاریخ',
      value: 'btime',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 dark:text-[#e8e7e7] text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
          />
        </svg>
      ),
      element: <BtimeSetting />,
    },
    {
      label: 'ویجت نرخ یاب',
      value: 'currency',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 dark:text-[#e8e7e7] text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
      element: <NerkhYabSetting />,
    },
    {
      label: 'ویجت ارز چند؟',
      value: 'arzChand',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 dark:text-[#e8e7e7] text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
      element: <ArzChandSetting />,
    },
    {
      label: 'ویجت آب و هوا',
      value: 'weather',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 dark:text-[#e8e7e7] text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      ),
      element: <WeatherSetting />,
    },
    {
      label: 'تنظیمات کلی',
      value: 'setting',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 dark:text-[#e8e7e7] text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 6h18M3 12h18M3 18h18"
          />
        </svg>
      ),
      element: <AppSetting />,
    },
    {
      label: 'خروج',
      value: 'ts',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 dark:text-[#e8e7e7] text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      ),
      isExit: true,
    },
  ]

  return (
    <>
      <div className="h-screen w-screen  moveable overflow-hidden">
        <div className="h-full " dir="rtl">
          <div className="flex flex-row h-screen">
            <Tabs value="btime" orientation="vertical">
              <TabsHeader
                className="w-36 gap-10 h-full not-moveable dark:bg-[#1d1d1d5b] bg-white py-5"
                indicatorProps={{
                  className: 'bg-white dark:bg-[#1d1d1d]',
                }}
              >
                {data.map(({ label, value, icon }) => (
                  <Tab
                    key={value}
                    value={value}
                    className="hover:bg-gray-100 transition-colors duration-200 rounded dark:hover:bg-[#1d1d1d]"
                  >
                    <div className="flex flex-row gap-2 items-center">
                      {icon}
                      <Typography className="font-[Vazir] font-semibold text-xs dark:text-[#e8e7e7] text-gray-600">
                        {label}
                      </Typography>
                    </div>
                  </Tab>
                ))}
              </TabsHeader>
              <TabsBody className="p-2 w-screen h-screen">
                {data.map(({ value, element, isExit }) =>
                  isExit ? (
                    <TabPanel key={value} value={value}>
                      <div className="flex flex-col items-center justify-center h-full">
                        <Typography className="font-[Vazir] font-bold text-gray-600 dark:text-[#e8e7e7]">
                          آیا مطمئن هستید؟
                        </Typography>
                        <Typography className="font-[Vazir] text-gray-600 dark:text-[#e8e7e7]">
                          برای اعمال تغییرات نیاز به کلیک بر روی &quot;خروج و
                          اعمال تغییرات&quot; دارید.
                        </Typography>

                        <div className="flex flex-row gap-4  items-center">
                          <button
                            className="bg-red-500 text-white font-[Vazir] font-light rounded-md px-4 py-2 mt-4 w-full transition duration-300 ease-in-out transform hover:bg-red-600 focus:bg-red-700"
                            onClick={() => window.ipcMain.reOpen()}
                          >
                            خروج و اعمال تغییرات
                          </button>

                          <button
                            className="bg-blue-500 text-white font-[Vazir] font-light rounded-md px-4 py-2 mt-4 w-32 transition duration-300 ease-in-out transform hover:bg-blue-600 focus:bg-blue-700"
                            onClick={() => window.close()}
                          >
                            انصراف
                          </button>
                        </div>
                      </div>
                    </TabPanel>
                  ) : (
                    <TabPanel key={value} value={value}>
                      {element}
                    </TabPanel>
                  )
                )}
              </TabsBody>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
