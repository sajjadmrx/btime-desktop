import { CurrencyDefaultComponent } from './currency-default.template'

interface Prop {
	currencies: string[]
}
export function CurrenciesDefault({ currencies }: Prop) {
	return (
		<div
			className="flex flex-col items-center w-full h-full gap-1 overflow-y-auto divide-y scrollbar-thin dark:divide-gray-300/20 divide-gray-300/20 hidden-scrollbar"
			dir="rtl"
		>
			{currencies.map((currency) => (
				<CurrencyDefaultComponent key={currency} currencyCode={currency} />
			))}
		</div>
	)
}
