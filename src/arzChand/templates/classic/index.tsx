import type { FetchedCurrency } from '../../../api/api'
import { CurrencyClassicComponent } from './currency-classic.template'

interface Prop {
	currencies: string[]
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
			className="flex flex-col items-center w-full h-64 gap-1 overflow-y-scroll divide-y scrollbar-thin not-moveable dark:divide-gray-300/20 divide-gray-300/20"
			style={{ maxHeight: '80vh' }}
			dir="rtl"
		>
			{currencies.map((currency) => (
				<CurrencyClassicComponent
					key={currency}
					currencyCode={currency}
					isTransparent={isTransparent}
					isBackgroundActive={isBackgroundActive}
				/>
			))}
		</div>
	)
}
