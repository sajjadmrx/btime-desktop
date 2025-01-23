export function convertPriceToMillions(
	price: string,
	lang: 'fa' | 'en',
): React.ReactNode {
	const numericPrice = Number.parseFloat(price.replace(/,/g, ''))
	if (Number.isNaN(numericPrice)) return <>{price}</>

	// Define labels for millions and billions based on language
	const labels = {
		en: { million: 'M', billion: 'B' },
		fa: { million: 'م‌ن', billion: 'م‌د' },
	}

	// Format numbers based on language
	const locale = lang === 'fa' ? 'fa-IR' : 'en-US'

	if (numericPrice >= 1000000000) {
		// Convert to billions
		const billions = numericPrice / 1000000000
		return (
			<>
				{billions.toLocaleString(locale, { maximumFractionDigits: 2 })}
				<span className="text-xs">{labels[lang].billion}</span>
			</>
		)
	}

	if (numericPrice >= 1000000) {
		// Convert to millions
		const millions = numericPrice / 1000000
		return (
			<>
				{millions.toLocaleString(locale, { maximumFractionDigits: 2 })}
				<span className="text-xs">{labels[lang].million}</span>
			</>
		)
	}

	// If the price is less than 1 million, return the original price formatted with commas
	return <>{numericPrice.toLocaleString(locale)}</>
}
