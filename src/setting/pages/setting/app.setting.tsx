import { Theme } from 'electron/store'
import { useEffect, useState } from 'react'
import { ThemeComponent } from './theme.component'
import { Checkbox, Typography } from '@material-tailwind/react'

export function AppSetting() {
  const [themeState, setTheme] = useState<Theme>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [moveable, setMoveable] = useState<boolean>(
    window.store.get('moveable')
  )

  useEffect(() => {
    setTheme(window.store.get('theme') as Theme)
  }, [])

  function onMoveableChange(value: boolean) {
    window.store.set('moveable', value)
  }

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
      <div className="p-2 mt-2 h-full not-moveable font-[Vazir]">
        <div
          className="w-full flex flex-col gap-4 px-5 text-right not-moveable "
          dir="rtl"
        >
          <div>
            <h1 className="dark:text-[#c7c7c7] text-gray-600 text-base font-semibold font-[Vazir]">
              تم
            </h1>
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
          <div>
            <Checkbox
              ripple={true}
              defaultChecked={moveable}
              onClick={() => onMoveableChange(!moveable)}
              label={
                <div>
                  <Typography
                    variant={'h5'}
                    color="blue-gray"
                    className="dark:text-[#c7c7c7] text-gray-600  text-[13px] font-[Vazir] font-normal"
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
          </div>
        </div>
      </div>
    </>
  )
}
