import moment from 'jalali-moment'
import hijriMoment from 'moment-hijri'
import type { FetchedAllEvents } from 'src/api/api.interface'
import type { FetchedEvent } from '../../api/hooks/events/getEvents.hook'

export function getJalaliFirstDayOfMonth(year: number, month: number) {
	const date = moment(`${year}-${month + 1}-1`, 'jYYYY-jM-jD')
	// Convert Sunday=0 to Saturday=0
	let weekDay = date.day()
	// Shift weekday to match Jalali calendar (Saturday=0)
	weekDay = (weekDay + 1) % 7
	return weekDay
}

export function getShamsiEvents(
	events: FetchedAllEvents,
	selectedDate: moment.Moment,
): FetchedEvent[] {
	const month = selectedDate.jMonth() + 1
	const day = selectedDate.jDate()
	return events.shamsiEvents.filter(
		(event) => event.month === month && event.day === day,
	)
}

export function getHijriEvents(
	events: FetchedAllEvents,
	selectedDate: moment.Moment,
): FetchedEvent[] {
	const hijriDate = convertShamsiToHijri(selectedDate)
	const month = hijriDate.iMonth() + 1
	const day = hijriDate.iDate()

	return events.hijriEvents.filter(
		(event) => event.month === month && event.day === day,
	)
}

export function getGregorianEvents(
	events: FetchedAllEvents,
	selectedDate: moment.Moment, //  Hijri date
): FetchedEvent[] {
	const gregorianDay = selectedDate.format('D')
	const gregorianMonth = selectedDate.format('M')
	return events.gregorianEvents.filter(
		(event) => event.month === +gregorianMonth && event.day === +gregorianDay,
	)
}

export function convertShamsiToHijri(
	shamsiDate: moment.Moment,
): hijriMoment.Moment {
	const shamsiMonth = shamsiDate.jMonth() + 1
	const shamsiDay = shamsiDate.jDate()

	let hijriDate = hijriMoment(
		shamsiDate.utc().startOf('day').format('YYYY-MM-DD'),
		'YYYY-MM-DD',
	)

	if (shamsiMonth <= 6) {
		if (shamsiDay <= 20) {
			hijriDate = hijriDate.subtract(1, 'day')
		}
	} else if (shamsiMonth <= 11) {
		if (shamsiDay <= 21) {
			hijriDate = hijriDate.subtract(1, 'day')
		}
	} else {
		if (shamsiDay <= 20) {
			hijriDate = hijriDate.subtract(1, 'day')
		}
	}

	return hijriDate
}
