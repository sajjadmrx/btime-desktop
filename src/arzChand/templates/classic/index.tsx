import type { CurrencyData } from '../../../api/api'
import { CurrencyClassicComponent } from './currency-classic.template'

interface Prop {
	currencies: (CurrencyData & { code })[]
	isTransparent: boolean
	isBackgroundActive
}
export function CurrenciesClassic({
	currencies,
	isTransparent,
	isBackgroundActive,
}: Prop) {
	return (
		<div
			className="flex flex-col items-center w-full px-2  h-64 overflow-y-scroll 
            scrollbar-thin not-moveable divide-y   dark:divide-gray-300/20 divide-gray-300/20"
			style={{ maxHeight: '80vh' }}
			dir="rtl"
		>
			{currencies?.length
				? currencies.map((currency, index) => (
						<CurrencyClassicComponent
							currency={currency}
							isTransparent={isTransparent}
							isBackgroundActive={isBackgroundActive}
							key={index}
						/>
					))
				: [...Array(5)].map((_, index) => (
						<CurrencyClassicComponent
							isBackgroundActive={isBackgroundActive}
							currency={null}
							isTransparent={isTransparent}
							key={index}
						/>
					))}
		</div>
	)
}
