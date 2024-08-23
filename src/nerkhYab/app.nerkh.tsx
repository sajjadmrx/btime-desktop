import { useEffect } from 'react'
import { CurrencyInfoCard } from './components/currencyCard.component'

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

  return (
    <div className="h-screen w-screen overflow-hidden" dir="rtl">
      <div className="moveable py-3 px-0 h-full" dir="rtl">
        <div
          className="flex flex-col gap-6 h-full justify-around items-center"
          dir="rtl"
        >
          <div
            className="h-full flex flex-col items-center justify-around w-full px-2 flex-wrap gap-5"
            style={{ maxHeight: '80vh' }}
            dir="rtl"
          >
            <CurrencyInfoCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
