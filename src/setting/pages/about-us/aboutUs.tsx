import { useEffect, useState } from 'react'
import { getSponsors } from '../../../api/api'

export function AboutUs() {
  const [sponsores, setSponsores] = useState<any[]>([])

  useEffect(() => {
    async function fetchSponsores() {
      getSponsors().then((data) => {
        setSponsores(data)
      })
    }

    fetchSponsores()

    return () => {
      setSponsores([])
    }
  }, [])

  return (
    <div className="p-2 h-96 flex flex-col justify-between not-moveable font-[Vazir]">
      <div className="flex flex-col px-2">
        <div className="flex flex-row items-center justify-between w-full gap-2">
          <div className="flex flex-col space-y-2">
            <div className="text-1xl font-bold text-gray-600 dark:text-[#c7c7c7]">
              درباره ما
            </div>
            <div className="text-xs  text-gray-600 dark:text-[#c7c7c7]">
              این برنامه با هدف ارائه ویجت های متنوع و کاربردی برای کاربران
              ایرانی طراحی شده است.
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-1xl font-bold text-gray-600 dark:text-[#c7c7c7]">
                لینک های ما
              </h1>
              <div className="flex flex-row  overflow-hidden not-moveable">
                <div
                  className="dark:hover:bg-gray-300/5 hover:bg-gray-400 rounded-full p-1 cursor-pointer"
                  onClick={() =>
                    window.ipcMain.openUrl(
                      'https://github.com/sajjadmrx/btime-desktop'
                    )
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    style={{ fill: '#181717' }}
                  >
                    <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                  </svg>
                </div>
                <div
                  className="dark:hover:bg-gray-300/5 hover:bg-gray-400 rounded-full p-1 cursor-pointer"
                  onClick={() =>
                    window.ipcMain.openUrl('https://discord.gg/YwnxbEBYGD')
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="30"
                    height="30"
                    style={{ fill: '#7289DA' }}
                    viewBox="0 0 50 50"
                  >
                    <path d="M 41.625 10.769531 C 37.644531 7.566406 31.347656 7.023438 31.078125 7.003906 C 30.660156 6.96875 30.261719 7.203125 30.089844 7.589844 C 30.074219 7.613281 29.9375 7.929688 29.785156 8.421875 C 32.417969 8.867188 35.652344 9.761719 38.578125 11.578125 C 39.046875 11.867188 39.191406 12.484375 38.902344 12.953125 C 38.710938 13.261719 38.386719 13.429688 38.050781 13.429688 C 37.871094 13.429688 37.6875 13.378906 37.523438 13.277344 C 32.492188 10.15625 26.210938 10 25 10 C 23.789063 10 17.503906 10.15625 12.476563 13.277344 C 12.007813 13.570313 11.390625 13.425781 11.101563 12.957031 C 10.808594 12.484375 10.953125 11.871094 11.421875 11.578125 C 14.347656 9.765625 17.582031 8.867188 20.214844 8.425781 C 20.0625 7.929688 19.925781 7.617188 19.914063 7.589844 C 19.738281 7.203125 19.34375 6.960938 18.921875 7.003906 C 18.652344 7.023438 12.355469 7.566406 8.320313 10.8125 C 6.214844 12.761719 2 24.152344 2 34 C 2 34.175781 2.046875 34.34375 2.132813 34.496094 C 5.039063 39.605469 12.972656 40.941406 14.78125 41 C 14.789063 41 14.800781 41 14.8125 41 C 15.132813 41 15.433594 40.847656 15.621094 40.589844 L 17.449219 38.074219 C 12.515625 36.800781 9.996094 34.636719 9.851563 34.507813 C 9.4375 34.144531 9.398438 33.511719 9.765625 33.097656 C 10.128906 32.683594 10.761719 32.644531 11.175781 33.007813 C 11.234375 33.0625 15.875 37 25 37 C 34.140625 37 38.78125 33.046875 38.828125 33.007813 C 39.242188 32.648438 39.871094 32.683594 40.238281 33.101563 C 40.601563 33.515625 40.5625 34.144531 40.148438 34.507813 C 40.003906 34.636719 37.484375 36.800781 32.550781 38.074219 L 34.378906 40.589844 C 34.566406 40.847656 34.867188 41 35.1875 41 C 35.199219 41 35.210938 41 35.21875 41 C 37.027344 40.941406 44.960938 39.605469 47.867188 34.496094 C 47.953125 34.34375 48 34.175781 48 34 C 48 24.152344 43.785156 12.761719 41.625 10.769531 Z M 18.5 30 C 16.566406 30 15 28.210938 15 26 C 15 23.789063 16.566406 22 18.5 22 C 20.433594 22 22 23.789063 22 26 C 22 28.210938 20.433594 30 18.5 30 Z M 31.5 30 C 29.566406 30 28 28.210938 28 26 C 28 23.789063 29.566406 22 31.5 22 C 33.433594 22 35 23.789063 35 26 C 35 28.210938 33.433594 30 31.5 30 Z"></path>
                  </svg>
                </div>
                <div
                  className="dark:hover:bg-gray-300/5 hover:bg-gray-400 rounded-full p-1 cursor-pointer"
                  onClick={() =>
                    window.ipcMain.openUrl('https://t.me/widgetify')
                  }
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
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-1xl font-bold text-gray-600 dark:text-[#c7c7c7]">
                حامیان
              </h1>
              <div className="flex flex-row gap-2 p-1 flex-wrap h-16  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-300">
                {sponsores.map((sponsor, index) => (
                  <div
                    key={index}
                    className="hover:underline text-blue-500 cursor-pointer text-sm  h-fit"
                    onClick={() => window.ipcMain.openUrl(sponsor.url)}
                  >
                    {sponsor.description}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-600 dark:text-[#c7c7c7]">
        با تشکر از همه کسانی که تو این پروژه مشارکت دارند. ☕💚 | نسخه{' '}
        {import.meta.env.PACKAGE_VERSION}
      </div>
    </div>
  )
}
