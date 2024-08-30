interface ThemeComponentProps {
  themeState: string
  setThemeValue: (value: string) => void

  theme: string
  icon: string
  text: string
}
export function ThemeComponent({
  setThemeValue,
  themeState,
  theme,
  text,
  icon,
}: ThemeComponentProps) {
  return (
    <div
      className={`h-full w-full flex transition duration-300
           ease-in-out  cursor-pointer   relative overflow-clip
          bg-gray-400/20 dark:bg-gray-400/5
           p-2 rounded-lg items-center
           justify-center
           ${themeState === theme ? 'outline outline-offset-2 outline-[#3f3fc9dd]' : 'hover:bg-[#3f3fc975]  dark:hover:bg-[#4040a7b3] hover:text-gray-200'}  
            `}
      onClick={() => setThemeValue(theme)}
    >
      <img
        src={`../assets/${icon}`}
        alt="light"
        className={`w-12 h-12 absolute left-16 top-10 z-0 ${themeState === theme ? 'opacity-50' : 'opacity-10'}`}
      />
      <p className="text-sm font-medium font-[Vazir]">{text}</p>
    </div>
  )
}
