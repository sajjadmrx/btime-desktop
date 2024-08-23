import { Theme } from 'electron/store'
import { useEffect, useState } from 'react'

export function AppSetting() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    setTheme(window.store.get('theme') as Theme)
  }, [])

  function setThemeValue(value: Theme) {
    setTheme(value)
    window.store.set('theme', value)
    window.ipcMain.changeTheme(value)
  }

  if (!theme) return null
  return (
    <>
      <div className="mt-2 justify-around  not-moveable font-[Vazir]">
        <div className="w-full px-5 text-right not-moveable " dir="rtl">
          <div className="flex flex-col dark:text-gray-400 text-gray-600">
            تم
            <div className="w-full flex flex-row justify-around px-3 gap-4 transition ">
              <div
                className={`w-20 flex flex-row transition active:outline-none cursor-pointer  ${theme === 'light' ? 'border border-[#3f3fc9dd]' : 'hover:bg-[#3f3fc975] bg-opacity-10 hover:text-gray-200'} p-2 rounded-lg items-center justify-center`}
                onClick={() => setThemeValue('light')}
              >
                <p className="text-[13px] font-[Vazir]">روشن</p>
              </div>
              <div
                className={`w-20 flex flex-row transition active:outline-none cursor-pointer ${theme === 'dark' ? 'border border-[#3f3fc9dd]' : 'hover:bg-[#3f3fc975] bg-opacity-10 hover:text-gray-200'} p-2 rounded-lg items-center justify-center`}
                onClick={() => setThemeValue('dark')}
              >
                <p className="text-[13px] font-[Vazir]">تاریک</p>
              </div>
              <div
                className={`w-20 flex flex-row transition active:outline-none cursor-pointer ${theme === 'system' ? 'border border-[#3f3fc9dd]' : 'hover:bg-[#3f3fc975] bg-opacity-10 hover:text-gray-200'} p-2 rounded-lg items-center justify-center`}
                onClick={() => setThemeValue('system')}
              >
                خودکار
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
