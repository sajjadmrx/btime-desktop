import { useEffect, useState } from 'react'
import { CurrencyData, getRateByCurrency } from '../api/api'
import { widgetKey } from '../../shared/widgetKey'
import { CurrencyComponent } from './component/currency.component'

function App() {
  const [currencies, setCurrencies] = useState<
    (CurrencyData & { imgColor; code })[]
  >([])
  const [reloading, setReloading] = useState(true)

  const [isTransparent, setIsTransparent] = useState<boolean>(
    document.body.classList.contains('transparent-active')
  )

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
    const observer = new MutationObserver(() => {
      setIsTransparent(document.body.classList.contains('transparent-active'))
    })
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    })

    colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange)
    return () => {
      colorSchemeMediaQuery.removeEventListener(
        'change',
        handleColorSchemeChange
      )
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (reloading) {
      setCurrencies([])
    }

    const currencyStore = window.store.get('ArzChand' as widgetKey.ArzChand)

    async function fetchData() {
      const newCurrencies = []

      for (const currency of currencyStore.currencies) {
        const data = await getRateByCurrency(currency)
        if (data) {
          newCurrencies.push({ ...data, imgColor: '', code: currency })
        }
      }

      setCurrencies((prev) => {
        const uniqueCurrencies = [...prev]

        for (const newCurrency of newCurrencies) {
          const existingIndex = uniqueCurrencies.findIndex(
            (c) => c.icon === newCurrency.icon
          ) // Assume there's an 'id' field
          if (existingIndex !== -1) {
            // Update existing currency
            uniqueCurrencies[existingIndex] = newCurrency
          } else {
            // Add new currency
            uniqueCurrencies.push(newCurrency)
          }
        }

        return uniqueCurrencies
      })
      setReloading(false)
    }

    if (reloading) {
      fetchData()
    }
  }, [reloading])

  return (
    <div className="moveable h-screen w-screen overflow-hidden">
      <div className="h-full">
        <div className="flex flex-col p-2 h-full  items-center">
          <div
            className="flex flex-col items-center w-full px-2  h-64 overflow-y-scroll 
            scrollbar-thin not-moveable"
            style={{ maxHeight: '80vh' }}
            dir="rtl"
          >
            {currencies?.length
              ? currencies.map((currency, index) => (
                  <CurrencyComponent currency={currency} key={index} />
                ))
              : [...Array(5)].map((_, index) => (
                  <CurrencyComponent currency={null} key={index} />
                ))}
          </div>
          {
            <div
              className="flex w-full p-2 h-10 items-center overflow-clip mt-2 transition-all duration-300 ease-in-out"
              dir="rtl"
            >
              <button
                className={`w-8 h-8 not-moveable flex justify-center items-center rounded-full 
                cursor-pointer  hover:bg-gray-500 hover:text-gray-300 dark:hover:bg-[#3c3c3c8a] dark:text-gray-400/90
                dark:bg-transparent
                 ${isTransparent ? 'text-gray-300' : 'text-gray-500'} 
                bg-gray-300/20
                ${reloading ? 'animate-spin' : 'animate-none'}
                `}
                style={{ backdropFilter: 'blur(20px)' }}
                onClick={() => setReloading(true)}
                disabled={reloading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default App
//bg-gray-400/50
