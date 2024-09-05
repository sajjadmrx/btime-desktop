import { useEffect, useState } from 'react'
import { CurrencyData, getRateByCurrency } from '../api/api'
import { widgetKey } from '../../shared/widgetKey'
import { CurrencyComponent } from './component/currency.component'

function App() {
  const [currencies, setCurrencies] = useState<
    (CurrencyData & { imgColor; code })[]
  >([])
  const [hoveredCurrency, setHoveredCurrency] = useState<boolean>(null)

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

  useEffect(() => {
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
    }

    fetchData()

    return () => {
      setCurrencies([])
    }
  }, [])

  return (
    <div className="moveable h-screen w-screen overflow-hidden">
      <div className="h-full">
        <div className="flex flex-col p-2 h-full  items-center">
          <div
            className="flex flex-col items-center w-full px-2  h-64 overflow-y-scroll 
            scrollbar-thin not-moveable"
            style={{ maxHeight: '80vh' }}
            dir="rtl"
            onMouseEnter={() => setHoveredCurrency(true)}
            onMouseLeave={() => setHoveredCurrency(false)}
          >
            {currencies?.length
              ? currencies.map((currency, index) => (
                  <CurrencyComponent currency={currency} key={index} />
                ))
              : [...Array(5)].map((_, index) => (
                  <CurrencyComponent currency={null} key={index} />
                ))}
          </div>
          {hoveredCurrency && (
            <div
              className="text-gray-600 text-gray-trasnparent dark:text-[#cbc9c9] font-light text-xs mt-2 transition-all duration-300 ease-in-out px-5"
              dir="rtl"
            >
              برای جابجایی این ویجت، این قسمت را کلیک کرده و نگه دارید و سپس به
              مکان مورد نظر بکشید
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
