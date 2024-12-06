import moment from 'jalali-moment'

export const getJalaliFirstDayOfMonth = (year, month) => {
	const firstDayOfMonth = moment(`${year}-${month + 1}-01`, 'jYYYY-jM-D').day()
	return firstDayOfMonth
}
