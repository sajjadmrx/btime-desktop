import { CurrencyDefaultComponent } from './currency-default.template'

interface Prop {
	currencies: string[]
}
export function CurrenciesDefault({ currencies }: Prop) {
	return (
		<div
			className="flex flex-col items-center w-full h-64 px-2 overflow-y-scroll scrollbar-thin not-moveable"
			style={{ maxHeight: '80vh' }}
			dir="rtl"
		>
			{currencies.map((currency) => (
				<CurrencyDefaultComponent key={currency} currencyCode={currency} />
			))}
		</div>
	)
}
