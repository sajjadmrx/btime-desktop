import ms from 'ms'
import { useEffect, useRef, useState } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6'
import { JSONParse } from '../../../../shared/util'
import type { FetchedCurrency } from '../../../api/api'
import { useGetCurrencyByCode } from '../../../api/hooks/currency/getCurrencyByCode.hook'

interface Prop {
	currencyCode: string
	isTransparent: boolean
	isBackgroundActive: boolean
}

export function CurrencyClassicComponent({
	currencyCode,
	isTransparent,
	isBackgroundActive,
}: Prop) {
	const [priceChange, setPriceChange] = useState(0)
	const [currency, setCurrencyData] = useState<FetchedCurrency | null>(
		JSONParse(`currency:${currencyCode}`),
	)

	const { data, dataUpdatedAt } = useGetCurrencyByCode(currencyCode, {
		refetchInterval: ms('1m'),
	})

	useEffect(() => {
		if (data) {
			setCurrencyData(data)
			window.store.set(`currency:${currencyCode}`, data)
			if (data.changePercentage) {
				const changeAmount = (data.changePercentage / 100) * data.price
				setPriceChange(changeAmount)
			}
		}
	}, [dataUpdatedAt])

	const isBackgroundVisible = !isTransparent && isBackgroundActive
	const isPriceUp = priceChange > 0
	const priceDirection = isPriceUp ? 'text-red-500' : 'text-green-500'
	const PriceIcon = isPriceUp ? FaCaretUp : FaCaretDown

	const textColor = isBackgroundVisible
		? '!text-gray-600 dark:!text-gray-300'
		: '!text-gray-300 dark:!text-gray-200'

	const currencyStyle = 'border-t border-gray-100/60 shadow-sm'

	let priceIconStyle = 'bg-white dark:bg-gray-800'
	if (isTransparent) {
		priceIconStyle = 'bg-transparent dark:bg-gray-800/80'
	} else if (!isBackgroundActive) {
		priceIconStyle = 'bg-transparent backdrop-blur text-gray-300'
	}

	return (
		<div
			className={`rounded-xl p-2 flex items-center justify-between w-full font-[balooTamma] transition-colors duration-200 first:border-none ${currencyStyle}`}
			dir="ltr"
		>
			<div className="flex items-center gap-2">
				{currency ? (
					<div className="relative">
						<img
							src={currency.icon}
							className={`w-6 h-6 rounded-full object-cover ${isTransparent ? 'opacity-70' : ''}`}
							alt={currency.code}
						/>
						<div
							className={`absolute -bottom-1 -right-1 ${priceDirection} text-xs rounded-full shadow ${priceIconStyle}`}
						>
							<PriceIcon />
						</div>
					</div>
				) : (
					<div className="w-6 h-6 bg-gray-200 rounded-full dark:bg-gray-700"></div>
				)}

				<div className="flex flex-col">
					{currency ? (
						<p
							className={`font-medium text-sm ${textColor} truncate max-w-[80px]`}
						>
							{currency.code?.toUpperCase()}
						</p>
					) : (
						<div className="w-10 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
					)}

					{priceChange !== 0 ? (
						<div className="flex items-center gap-1">
							<span
								className={`text-xs ${priceDirection} truncate max-w-[60px]`}
							>
								{Math.abs(Math.round(priceChange)).toLocaleString()}
							</span>
						</div>
					) : (
						<span className="text-xs text-gray-400 dark:text-gray-500">-</span>
					)}
				</div>
			</div>

			<div className="flex items-end">
				{currency ? (
					<p
						className={`font-medium text-xs ${textColor} tabular-nums truncate max-w-[100px]`}
					>
						{currency.rialPrice
							? Math.round(currency.rialPrice).toLocaleString()
							: '-'}
					</p>
				) : (
					<div className="w-20 h-5 bg-gray-100 rounded dark:bg-gray-800"></div>
				)}
			</div>
		</div>
	)
}
