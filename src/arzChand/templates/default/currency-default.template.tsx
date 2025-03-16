import ms from 'ms'
import { useEffect, useRef, useState } from 'react'
import { JSONParse } from '../../../../shared/util'
import type { FetchedCurrency } from '../../../api/api'
import { useGetCurrencyByCode } from '../../../api/hooks/currency/getCurrencyByCode.hook'
import { extractMainColorFromImage } from '../../../utils/colorUtils'

interface Prop {
	currencyCode: string
	isBackgroundActive: boolean
	isTransparent: boolean
}

export function CurrencyDefaultComponent({
	currencyCode,
	isBackgroundActive,
	isTransparent,
}: Prop) {
	if (!currencyCode) {
		return null
	}

	const [currency, setCurrencyData] = useState<FetchedCurrency | null>(
		JSONParse(`currency:${currencyCode}`),
	)
	const [imgColor, setImgColor] = useState('')

	const { data, dataUpdatedAt } = useGetCurrencyByCode(currencyCode, {
		refetchInterval: ms('1m'),
	})

	useEffect(() => {
		if (data) {
			setCurrencyData(data)
			window.store.set(`currency:${currencyCode}`, data)
		}
	}, [dataUpdatedAt])

	useEffect(() => {
		if (currency?.icon) {
			extractMainColorFromImage(currency.icon).then((color) => {
				setImgColor(color)
			})
		}
	}, [currency?.icon])

	let textColor = 'text-gray-600 dark:text-[#d3d3d3]'
	if (isTransparent || !isBackgroundActive) {
		textColor = 'text-gray-400'
	}

	return (
		<div className="flex flex-row flex-wrap items-center justify-around w-full gap-2">
			<div className="flex flex-row items-end flex-1 gap-1 truncate w-52 justify">
				<div className="text-[.9rem] flex flex-col text-gray-600 dark:text-[#eee] truncate">
					<div className="flex flex-row items-center justify-end flex-1 p-2 mt-1 truncate rounded-full w-52">
						<div className="flex justify-center w-10" dir="rtl">
							<div className="relative flex w-4 h-4 rounded-full">
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
											alt={currency.code}
										/>
									</>
								) : (
									<div className="w-full h-full bg-gray-200 rounded-full"></div>
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
								<div className="h-5 mr-3 bg-gray-200/70 rounded-full w-20 mb-2.5"></div>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-end truncate flex-2 justify">
				{currency ? (
					<>
						<p
							className={`xs:text-xs sm:text-sm lg:text-[1rem] ${textColor}`}
							dir="ltr"
						>
							{currency.rialPrice ? currency.rialPrice.toLocaleString() : '-'}
						</p>
						<p className={`text-xs font-light ${textColor}`} dir="ltr">
							1 {currency.code?.toUpperCase()}
						</p>
					</>
				) : (
					<>
						<p className="items-center w-5 h-3 mr-3 truncate rounded-full bg-gray-200/70"></p>
						<p className="items-center w-3 h-2 mt-1 mr-3 truncate rounded-full bg-gray-200/70"></p>
					</>
				)}
			</div>
		</div>
	)
}
