export function JSONParse<T>(data: string): T | null {
	try {
		return JSON.parse(data)
	} catch (error) {
		return null
	}
}
