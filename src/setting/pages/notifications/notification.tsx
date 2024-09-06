import { useEffect, useState } from 'react'
import { getNotifications } from '../../../api/api'

export function NotificationPage() {
  const [notification, setNotfication] = useState<{ text: string }>(null)

  useEffect(() => {
    getNotifications().then((res) => {
      setNotfication(res)
    })
  }, [])

  return (
    <div className="p-2 h-96 flex flex-col justify-between not-moveable font-[Vazir]">
      <div className="flex flex-col px-2">
        <div className="flex flex-col space-y-2 h-24">
          <div className="text-1xl font-bold text-gray-600 dark:text-[#c7c7c7]">
            جزئیات آخرین بروزرسانی
          </div>
          <div className="text-xs  text-gray-600 dark:text-[#e7e7e7] h-36 w-full  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-300">
            <div
              className="dark:hover:bg-gray-300/5 hover:bg-gray-400/50 rounded-full p-1 cursor-pointer flex flex-row items-center gap-2"
              onClick={() => window.ipcMain.openUrl('https://t.me/widgetify')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Livello_1"
                data-name="Livello 1"
                viewBox="0 0 240 240"
                width="30"
                height="30"
              >
                <defs>
                  <linearGradient
                    id="linear-gradient"
                    x1="120"
                    y1="240"
                    x2="120"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#1d93d2" />
                    <stop offset="1" stopColor="#38b0e3" />
                  </linearGradient>
                </defs>
                <circle
                  cx="120"
                  cy="120"
                  r="120"
                  fill="url(#linear-gradient)"
                />
                <path
                  d="M81.229,128.772l14.237,39.406s1.78,3.687,3.686,3.687,30.255-29.492,30.255-29.492l31.525-60.89L81.737,118.6Z"
                  fill="#c8daea"
                />
                <path
                  d="M100.106,138.878l-2.733,29.046s-1.144,8.9,7.754,0,17.415-15.763,17.415-15.763"
                  fill="#a9c6d8"
                />
                <path
                  d="M81.486,130.178,52.2,120.636s-3.5-1.42-2.373-4.64c.232-.664.7-1.229,2.1-2.2,6.489-4.523,120.106-45.36,120.106-45.36s3.208-1.081,5.1-.362a2.766,2.766,0,0,1,1.885,2.055,9.357,9.357,0,0,1,.254,2.585c-.009.752-.1,1.449-.169,2.542-.692,11.165-21.4,94.493-21.4,94.493s-1.239,4.876-5.678,5.043A8.13,8.13,0,0,1,146.1,172.5c-8.711-7.493-38.819-27.727-45.472-32.177a1.27,1.27,0,0,1-.546-.9c-.093-.469.417-1.05.417-1.05s52.426-46.6,53.821-51.492c.108-.379-.3-.566-.848-.4-3.482,1.281-63.844,39.4-70.506,43.607A3.21,3.21,0,0,1,81.486,130.178Z"
                  fill="#fff"
                />
              </svg>
              برای اطلاع از آخرین تغییرات و بهبودهای این نرم افزار به کانال
              تلگرام ما مراجعه کنید.
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 h-fit">
          <div className="text-1xl font-bold text-gray-600 dark:text-[#c7c7c7]">
            پیام ها
          </div>
          <div className="text-xs  text-gray-600 dark:text-[#c7c7c7] h-36 w-full  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-300">
            {notification && (
              <NotifComponent text={notification?.text || 'پیام'} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
interface Prop {
  text: string
}
function NotifComponent({ text }: Prop) {
  return (
    <div className="dark:bg-gray-300/5 bg-gray-200/60 text-gray-600 dark:text-gray-300 rounded p-1 cursor-pointer flex flex-row items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 flex"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"
        />
      </svg>
      <p className="flex-1">{text}</p>
    </div>
  )
}
