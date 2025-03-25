import { CurrencyDefaultComponent } from './currency-default.template'

interface Prop {
	currencies: string[]
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
			className="flex flex-col items-center w-full h-64 px-2 overflow-y-scroll scrollbar-thin not-moveable"
			style={{ maxHeight: '80vh' }}
			dir="rtl"
		>
			{currencies.map((currency) => (
				<CurrencyDefaultComponent
					key={currency}
					currencyCode={currency}
					isTransparent={isTransparent}
					isBackgroundActive={isBackgroundActive}
				/>
			))}
		</div>
	)
}
