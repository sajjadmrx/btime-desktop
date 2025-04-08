export function formatSubscribeCount(num: number) {
	switch (true) {
		case num >= 1e9:
			return `${(num / 1e9).toFixed(1)}B`
		case num >= 1e6:
			return `${(num / 1e6).toFixed(1)}M`
		case num >= 1e3:
			return `${(num / 1e3).toFixed(1)}K`
		default:
			return num.toString()
	}
}
