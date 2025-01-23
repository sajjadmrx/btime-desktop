import moment from 'jalali-moment'

export function getJalaliFirstDayOfMonth(year: number, month: number) {
	const date = moment(`${year}-${month + 1}-1`, 'jYYYY-jM-jD')
	// Convert Sunday=0 to Saturday=0
	let weekDay = date.day()
	// Shift weekday to match Jalali calendar (Saturday=0)
	weekDay = (weekDay + 1) % 7
	return weekDay
}
