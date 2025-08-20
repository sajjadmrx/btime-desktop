import type { FetchedCurrency } from '../../../api/api'
import { CurrencyClassicComponent } from './currency-classic.template'

interface Prop {
	currencies: string[]
}
export function CurrenciesClassic({ currencies }: Prop) {
	return (
		<div
			className="flex flex-col items-center w-full h-full gap-1 overflow-y-auto divide-y scrollbar-thin dark:divide-gray-300/20 divide-gray-300/20 hidden-scrollbar not-moveable"
			dir="rtl"
		>
			{currencies.map((currency) => (
				<CurrencyClassicComponent key={currency} currencyCode={currency} />
			))}
		</div>
	)
}
