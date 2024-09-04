import { useEffect, useState } from 'react'
import { CurrencyData, getRateByCurrency } from '../../api/api'
import { extractMainColorFromImage } from '../../utils/colorUtils'
import { widgetKey } from '../../../shared/widgetKey'

export function CurrencyInfoCard() {
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState<string>()
  const [imgColor, setImgColor] = useState<string>()
  const [currencyData, setCurrencyData] = useState<CurrencyData>(null)

  useEffect(() => {
    const currencyStore = window.store.get('NerkhYab' as widgetKey.NerkhYab)
    setCurrency(currencyStore.currencies[0])

    async function fetchData() {
      const data = await getRateByCurrency(currencyStore.currencies[0])
      if (data) {
        setCurrencyData(data)
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      setCurrencyData(undefined)
      setLoading(true)
    }
  }, [])

  useEffect(() => {
    if (currencyData && currency) {
      extractMainColorFromImage(currencyData.icon).then((color) => {
        setImgColor(color)
      })
    }
  }, [currencyData, currency])

  return (
    <div
      className="flex flex-col gap-6 h-full justify-around items-center relative"
      dir="ltr"
    >
      <div className="flex flex-row items-center justify-around  w-full flex-wrap space-x-1">
        <div>
          {loading ? (
            <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700"></div>
          ) : (
            <div
              className={`w-10 h-10 relative flex rounded-full`}
              style={{
                backdropFilter: 'blur(100px)',
              }}
            >
              <div
                className={`
           w-32 h-10 absolute rounded-full z-0 -left-10 blur-lg `}
                style={{
                  backgroundImage: `radial-gradient(50% 50% at 50% 50%, ${imgColor} 35%, ${imgColor + '00'} 50%)`,
                }}
              ></div>
              <img
                src={currencyData.icon}
                className="object-cover z-10 rounded-full"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col w-32 justify items-end truncate ">
          {loading ? (
            <div className="h-5 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-2.5"></div>
          ) : (
            <h3
              className="lg:text-[1.1rem] sm:text-sm font-normal  text-gray-600 text-gray-trasnparent dark:text-[#eee] truncate w-32"
              dir="rtl"
            >
              {currencyData.name}
            </h3>
          )}
        </div>
      </div>
      <div className="flex flex-row w-full  items-center">
        <div className="flex flex-col">
          <div>
            {loading ? (
              <div className="h-2 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-10 mb-2.5"></div>
            ) : (
              <p className="lg:text-[1.2rem] sm:text-sm md:text-[.9rem]  text-gray-600 text-gray-trasnparent dark:text-[#d3d3d3]">
                {currencyData.todyPrice.toLocaleString()}
              </p>
            )}
          </div>
          <div>
            {loading ? (
              <div className="h-2 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-5 mb-2.5"></div>
            ) : (
              <p className="text-xs font-light text-gray-600 text-gray-trasnparent dark:text-[#cbc9c9]">
                1 {currency.toUpperCase()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
