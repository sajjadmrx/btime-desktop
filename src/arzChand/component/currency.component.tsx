import { useEffect, useState } from 'react'
import { CurrencyData } from '../../api/api'
import { extractMainColorFromImage } from '../../utils/colorUtils'
interface Prop {
  currency: (CurrencyData & { imgColor; code }) | null
}
export function CurrencyComponent({ currency }: Prop) {
  const [imgColor, setImgColor] = useState('')
  useEffect(() => {
    function fetchColor() {
      if (currency?.icon) {
        extractMainColorFromImage(currency.icon).then((color) => {
          setImgColor(color)
        })
      }
    }

    fetchColor()

    return () => {
      fetchColor()
    }
  }, [])

  return (
    <div className="flex flex-row items-center  justify-around  w-full flex-wrap gap-2">
      <div className="flex-1 flex flex-row gap-1 w-52 justify items-end truncate ">
        <div className="text-[.9rem] flex flex-col text-gray-600 text-gray-trasnparent  dark:text-[#eee] truncate">
          <div className="flex-1 flex flex-row w-52 items-center justify-end mt-1 p-2 rounded-full truncate ">
            <div className="w-10 flex justify-center" dir="rtl">
              <div
                className={`w-8 h-8 relative  flex rounded-full overflow-hidden`}
                style={{
                  backdropFilter: 'blur(100px)',
                  boxShadow: `0px 0px 4px 1px ${imgColor}`,
                }}
              >
                {currency ? (
                  <img src={currency.icon} className="object-cover" />
                ) : (
                  <div className="animate-pulse bg-gray-200 w-full h-full"></div>
                )}
              </div>
            </div>
            <div className="flex-1 w-40">
              {currency ? (
                <p className="mr-3 truncate w-40 xs:text-xs sm:text-sm md:text-base">
                  {currency.name}
                </p>
              ) : (
                <p className="mr-3 items-center truncate w-20 h-3 animate-pulse bg-gray-200/70 rounded-sm"></p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-2 flex flex-col justify items-end truncate ">
        {currency ? (
          <>
            <p className="xs:text-xs sm:text-sm lg:text-[1rem] text-gray-600 text-gray-trasnparent dark:text-[#d3d3d3]">
              {currency.todyPrice.toLocaleString()}
            </p>
            <p
              className="text-xs font-light text-gray-600 text-gray-trasnparent dark:text-[#cbc9c9]"
              dir="ltr"
            >
              1 {currency.code}
            </p>
          </>
        ) : (
          <>
            <p className="mr-3 items-center truncate w-3 h-3 animate-pulse bg-gray-200/70 rounded-sm"></p>
            <p className="mr-3 items-center truncate w-2 h-2 mt-1 animate-pulse bg-gray-200/70 rounded-sm"></p>
          </>
        )}
      </div>
    </div>
  )
}
