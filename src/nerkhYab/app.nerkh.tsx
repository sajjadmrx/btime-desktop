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
      <div className="h-screen w-screen overflow-hidden">
        <div className="moveable py-3 px-0 h-full">
          <div className="flex flex-col gap-6 h-full justify-around items-center">
            <div className="flex flex-row items-center justify-around  w-full flex-wrap gap-2">
              <div>
                {loading ? (
                  <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700"></div>
                ) : (
                  <img src={`./assets/countries/usa.png`} />
                )}
              </div>
              <div className="flex flex-col w-32 justify items-end truncate">
                {loading ? (
                  <div className="h-5 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-2.5"></div>
                ) : (
                  <h3 className="text-[1.2rem] text-gray-600 text-gray-trasnparent dark:text-[#eee] truncate">
                    {data.name}
                  </h3>
                )}
                {/* <h6 className="text-[.7rem]  text-[#858585]">
                  پووف! خیلی گرونه 😁
                </h6> */}
              </div>
            </div>
            <div className="flex flex-row w-full justify-around items-center">
              <div className="flex flex-col">
                <div>
                  {loading ? (
                    <div className="h-2 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-10 mb-2.5"></div>
                  ) : (
                    <p className="text-2xl text-gray-600 text-gray-trasnparent dark:text-[#d3d3d3]">
                      {data.todyPrice.toLocaleString()}
                    </p>
                  )}
                </div>
                <div>
                  {loading ? (
                    <div className="h-2 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-5 mb-2.5"></div>
                  ) : (
                    <p className="text-xs text-gray-600 text-gray-trasnparent dark:text-[#cbc9c9]">
                      1 USD
                    </p>
                  )}
                </div>
              </div>
              <div style={{ visibility: 'hidden' }}>aaaaaaaaa</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
