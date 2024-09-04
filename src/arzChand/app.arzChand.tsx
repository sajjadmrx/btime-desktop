import { useEffect, useState } from 'react'
import { CurrencyData, getRateByCurrency } from '../api/api'
import { extractMainColorFromImage } from '../utils/colorUtils'
import { widgetKey } from '../../shared/widgetKey'

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
          const imgColor = await extractMainColorFromImage(data.icon)
          newCurrencies.push({ ...data, imgColor, code: currency })
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
      // setCurrencies(undefined)
      // setLoading(true)
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
            {currencies.map((currency, index) => (
              <div
                key={index}
                className="flex flex-row items-center  justify-around  w-full flex-wrap gap-2"
              >
                <div className="flex-1 flex flex-row gap-1 w-52 justify items-end truncate ">
                  <div className="text-[.9rem] flex flex-col text-gray-600 text-gray-trasnparent  dark:text-[#eee] truncate">
                    <div className="flex-1 flex flex-row w-52 items-center justify-end mt-1 p-2 rounded-full truncate ">
                      <div>
                        <div
                          className={`w-8 h-8 relative  flex rounded-full overflow-hidden`}
                          style={{
                            backdropFilter: 'blur(100px)',
                            boxShadow: `0px 0px 4px 1px ${currency.imgColor}`,
                          }}
                        >
                          <img src={currency.icon} className="object-cover" />
                        </div>
                      </div>
                      <p className="mr-3 truncate w-40">{currency.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-2 flex flex-col justify items-end truncate ">
                  <p className="text-[1rem] text-gray-600 text-gray-trasnparent dark:text-[#d3d3d3]">
                    {currency.todyPrice.toLocaleString()}
                  </p>
                  <p
                    className="text-xs font-light text-gray-600 text-gray-trasnparent dark:text-[#cbc9c9]"
                    dir="ltr"
                  >
                    1 {currency.code}
                  </p>
                </div>
              </div>
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
