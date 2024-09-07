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
import { BtimeSetting } from './pages/btime/btime.setting'
import { NerkhYabSetting } from './pages/nerkhyab/nerkhYab.setting'
import { AppSetting } from './pages/setting/app.setting'
import { ArzChandSetting } from './pages/arzChand/arzChand.setting'
import { WeatherSetting } from './pages/weather/weather.setting'
import { AboutUs } from './pages/about-us/aboutUs'
import { NotificationPage } from './pages/notifications/notification'

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

  function onExitButtonClick() {
    const x = data.find((x) => x.isExit)
    document.querySelector(`[data-value="${x.value}"]`).click()
  }

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
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      ),
      element: <AppSetting />,
    },
    {
      label: 'پیام ها',
      value: 'notification',
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
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
          />
        </svg>
      ),
      element: <NotificationPage />,
    },
    {
      label: 'درباره ما',
      value: 'about',
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
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
      ),
      element: <AboutUs />,
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
      <div className="h-screen w-screen  moveable overflow-hidden ">
        <div className="w-full h-7 flex dark:bg-[#14141495] bg-white/65">
          <button
            className="w-7 h-7 ml-5 flex items-center not-moveable group justify-center hover:bg-red-400 dark:hover:bg-[#b94a4aad] transition-colors duration-200 rounded
            "
            onClick={() => onExitButtonClick()}
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
        <div className="flex flex-row h-full pb-5" dir="rtl">
          <Tabs value="btime" orientation="vertical">
            <TabsHeader
              className="w-36 h-full not-moveable dark:bg-[#1d1d1d5b] rounded-none  bg-white py-5"
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
            <TabsBody className="w-screen">
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
                          className="dark:text-gray-300 text-gray-600 font-[Vazir] font-light rounded-md px-4 py-2 mt-4 w-32 transition duration-300 ease-in-out transform 
                          hover:bg-blue-600/30
                          hover:dark:text-gray-100
                          hover:text-gray-100
                          focus:bg-blue-700"
                          onClick={() => window.close()}
                        >
                          انصراف
                        </button>
                      </div>
                    </div>
                  </TabPanel>
                ) : (
                  <TabPanel key={value} value={value} className="h-screen">
                    {element}
                  </TabPanel>
                )
              )}
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default App
