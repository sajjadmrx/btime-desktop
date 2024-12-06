import { useEffect, useState } from 'react'
import type { CurrencyData } from '../../../api/api'
import { extractMainColorFromImage } from '../../../utils/colorUtils'
interface Prop {
	currency: (CurrencyData & { imgColor; code }) | null
	isBackgroundActive: boolean
	isTransparent: boolean
}
export function CurrencyDefaultComponent({
	currency,
	isBackgroundActive,
	isTransparent,
}: Prop) {
	let textColor = 'text-gray-600 text-gray-trasnparent dark:text-[#d3d3d3]'
	if (isTransparent || !isBackgroundActive) {
		textColor = 'text-gray-400'
	}

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
	}, [currency?.icon])

	return (
		<div className="flex flex-row items-center  justify-around  w-full flex-wrap gap-2">
			<div className="flex-1 flex flex-row gap-1 w-52 justify items-end truncate ">
				<div className="text-[.9rem] flex flex-col text-gray-600 text-gray-trasnparent  dark:text-[#eee] truncate">
					<div className="flex-1 flex flex-row w-52 items-center justify-end mt-1 p-2 rounded-full truncate ">
						<div className="w-10 flex justify-center" dir="rtl">
							<div className={'w-4 h-4 relative flex rounded-full'}>
								{currency ? (
									<>
										<div
											className="absolute inset-0 h-4 w-4 rounded-full z-0"
											style={{
												backdropFilter: 'blur(100px)',
												boxShadow: `0px 0px 5px 2px ${imgColor}`,
											}}
										></div>
										<img
											src={currency.icon}
											className="object-cover rounded-full w-4 h-4 z-10"
										/>
									</>
								) : (
									<div className="animate-pulse bg-gray-200 w-full h-full rounded-full"></div>
								)}
							</div>
						</div>
						<div className="flex-1 w-40">
							{currency ? (
								<p
									className={`mr-3 truncate w-40 xs:text-xs sm:text-sm md:text-base ${textColor}`}
								>
									{currency.name}
								</p>
							) : (
								<div className="h-5 mr-3 animate-pulse items-center  bg-gray-200/70  rounded-full w-20 mb-2.5"></div>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="flex-2 flex flex-col justify items-end truncate ">
				{currency ? (
					<>
						<p className={`xs:text-xs sm:text-sm lg:text-[1rem] ${textColor}`}>
							{currency.todyPrice.toLocaleString()}
						</p>
						<p className={`text-xs font-light ${textColor}`} dir="ltr">
							1 {currency.code?.toUpperCase()}
						</p>
					</>
				) : (
					<>
						<p className="mr-3 items-center truncate w-5 h-3 animate-pulse bg-gray-200/70  rounded-full"></p>
						<p className="mr-3 items-center truncate w-3 h-2 mt-1 animate-pulse bg-gray-200/70  rounded-full"></p>
					</>
				)}
			</div>
		</div>
	)
}
