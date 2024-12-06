import type { CurrencyData } from '../../../api/api'
import { CurrencyDefaultComponent } from './currency-default.template'

interface Prop {
	currencies: (CurrencyData & { imgColor; code })[]
	isTransparent: boolean
	isBackgroundActive: boolean
}
export function CurrenciesDefault({
	currencies,
	isBackgroundActive,
	isTransparent,
}: Prop) {
	return (
		<div
			className="flex flex-col items-center w-full px-2  h-64 overflow-y-scroll 
            scrollbar-thin not-moveable"
			style={{ maxHeight: '80vh' }}
			dir="rtl"
		>
			{currencies?.length
				? currencies.map((currency, index) => (
						<CurrencyDefaultComponent
							isTransparent={isTransparent}
							currency={currency}
							key={index}
							isBackgroundActive={isBackgroundActive}
						/>
					))
				: [...Array(5)].map((_, index) => (
						<CurrencyDefaultComponent
							currency={null}
							key={index}
							isBackgroundActive={isBackgroundActive}
							isTransparent={isTransparent}
						/>
					))}
		</div>
	)
}
