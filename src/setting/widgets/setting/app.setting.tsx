import { Theme } from 'electron/store'
import { useEffect, useState } from 'react'
import { ThemeComponent } from './theme.component'

export function AppSetting() {
  const [themeState, setTheme] = useState<Theme>(null)

  useEffect(() => {
    setTheme(window.store.get('theme') as Theme)
  }, [])

  function setThemeValue(value: Theme) {
    setTheme(value)
    window.store.set('theme', value)
    window.ipcMain.changeTheme(value)
  }

  if (!themeState) return null

  const thmes = [
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
      <div className="mt-2 justify-around  not-moveable font-[Vazir]">
        <div className="w-full px-5 text-right not-moveable " dir="rtl">
          <div className="flex flex-col dark:text-gray-400 text-gray-600">
            تم
            <div className="w-full flex flex-row justify-around px-3 gap-4  duration-200 h-20 mt-2">
              {thmes.map((item, index) => (
                <ThemeComponent
                  key={index}
                  setThemeValue={setThemeValue}
                  themeState={themeState}
                  theme={item.theme}
                  text={item.text}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
