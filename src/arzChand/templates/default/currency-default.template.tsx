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
		<div className="flex flex-row flex-wrap items-center justify-around w-full gap-2">
			<div className="flex flex-row items-end flex-1 gap-1 truncate w-52 justify ">
				<div className="text-[.9rem] flex flex-col text-gray-600 text-gray-trasnparent  dark:text-[#eee] truncate">
					<div className="flex flex-row items-center justify-end flex-1 p-2 mt-1 truncate rounded-full w-52 ">
						<div className="flex justify-center w-10" dir="rtl">
							<div className={'w-4 h-4 relative flex rounded-full'}>
								{currency ? (
									<>
										<div
											className="absolute inset-0 z-0 w-4 h-4 rounded-full"
											style={{
												backdropFilter: 'blur(100px)',
												boxShadow: `0px 0px 5px 2px ${imgColor}`,
											}}
										></div>
										<img
											src={currency.icon}
											className="z-10 object-cover w-4 h-4 rounded-full"
										/>
									</>
								) : (
									<div className="w-full h-full bg-gray-200 rounded-full animate-pulse"></div>
								)}
							</div>
						</div>
						<div className="flex-1 w-40">
							{currency ? (
								<p
									className={`mr-3 truncate w-40 xs:text-xs sm:text-sm md:text-base ${textColor}`}
								>
									{currency.name.fa}
								</p>
							) : (
								<div className="h-5 mr-3 animate-pulse items-center  bg-gray-200/70  rounded-full w-20 mb-2.5"></div>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-end truncate flex-2 justify ">
				{currency ? (
					<>
						<p
							className={`xs:text-xs sm:text-sm lg:text-[1rem] ${textColor}`}
							dir="ltr"
						>
							{currency.rialPrice.toLocaleString()}
						</p>
						<p className={`text-xs font-light ${textColor}`} dir="ltr">
							1 {currency.code?.toUpperCase()}
						</p>
					</>
				) : (
					<>
						<p className="items-center w-5 h-3 mr-3 truncate rounded-full animate-pulse bg-gray-200/70"></p>
						<p className="items-center w-3 h-2 mt-1 mr-3 truncate rounded-full animate-pulse bg-gray-200/70"></p>
					</>
				)}
			</div>
		</div>
	)
}
