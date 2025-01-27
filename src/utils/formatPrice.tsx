export function convertPriceToMillions(
	price: string | number,
	lang: 'fa' | 'en',
): React.ReactNode {
	const numericPrice =
		typeof price === 'string'
			? Number.parseFloat(price.replace(/,/g, ''))
			: price

	if (Number.isNaN(numericPrice)) return <>{numericPrice.toLocaleString()}</>

	const labels = {
		en: { million: 'M', billion: 'B' },
		fa: { million: 'م‌ن', billion: 'م‌د' },
	}

	const locale = lang === 'fa' ? 'fa-IR' : 'en-US'

	if (numericPrice >= 1000000000) {
		const billions = numericPrice / 1000000000
		return (
			<>
				{billions.toLocaleString(locale, { maximumFractionDigits: 2 })}
				<span className="ml-[1px]">{labels[lang].billion}</span>
			</>
		)
	}

	if (numericPrice >= 1000000) {
		const millions = numericPrice / 10000000
		return (
			<>
				{millions.toLocaleString(locale, { maximumFractionDigits: 2 })}
				<span className="ml-[1px] text-xs">{labels[lang].million}</span>
			</>
		)
	}

	return <>{numericPrice.toLocaleString(locale)}</>
}
