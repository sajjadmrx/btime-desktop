import { useEffect, useState } from 'react'
import { CurrencyData, getRateByCurrency } from '../api/nerkh.api'

function App() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<CurrencyData>()

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
    function fetchData() {
      getRateByCurrency('usd').then((data) => {
        if (data) {
          setData(data)
          setLoading(false)
        }
      })
    }

    fetchData()

    return () => {
      setData(undefined)
      setLoading(true)
    }
  }, [])

  return (
    <>
      <div className="h-screen w-screen">
        <div className="flex flex-col h-full justify-around items-center moveable">
          <div className="flex flex-row items-center justify-around  w-full">
            <div>
              {loading ? (
                <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700"></div>
              ) : (
                <img src={`/public/assets/countries/usa.png`} />
              )}
            </div>
            <div className="flex flex-col w-32 justify items-end">
              {loading ? (
                <div className="h-6 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-2.5"></div>
              ) : (
                <h3 className="text-[1.5rem] text-[#737373] dark:text-[#eee]">
                  {data.name}
                </h3>
              )}
              {/* <h6 className="text-[.7rem]  text-[#858585]">
                پووف! خیلی گرونه 😁
              </h6> */}
            </div>
          </div>
          <div className="flex flex-row items-center w-full">
            <div className="flex flex-col ml-7">
              <div>
                {/* <p className="text-2xl text-[#525252]">59,800</p> */}
                {loading ? (
                  <div className="h-2 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-10 mb-2.5"></div>
                ) : (
                  <p className="text-2xl text-[#525252] dark:text-[#d3d3d3]">
                    {data.todyPrice.toLocaleString()}
                  </p>
                )}
              </div>
              <div>
                {/* <p className="text-xs text-gray-500">1 USD</p> */}
                {loading ? (
                  <div className="h-2 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-5 mb-2.5"></div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-[#cbc9c9]">
                    1 USD
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
