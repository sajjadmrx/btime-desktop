import jalaliMoment from 'jalali-moment'
import hijriMoment from 'moment-hijri'
import type {
	FetchedAllEvents,
	FetchedEvent,
} from '../../api/hooks/events/getEvents.hook'
import type { GoogleCalendarEvent } from '../../api/hooks/events/getGoogleCalendarEvents.hook'

export const formatDateStr = (date: jalaliMoment.Moment) => {
	return `${(date.jMonth() + 1).toString().padStart(2, '0')}-${date.jDate().toString().padStart(2, '0')}`
}

export type WidgetifyDate = jalaliMoment.Moment

export const iranianHijriMonthDays: {
	[key: number]: { [key: number]: number }
} = {
	1445: {
		1: 30,
		2: 29,
		3: 30,
		4: 29,
		5: 30,
		6: 29,
		7: 30,
		8: 29,
		9: 30,
		10: 29,
		11: 30,
		12: 29,
	},
	1446: {
		1: 30, // 1= محرم
		2: 30, // 2= صفر
		3: 30, // 3= ربیع الاول
		4: 29, // 4= ربیع الثانی
		5: 30, // 5= 	جمادی الاول
		6: 30, // 6= 	جمادی الثانی
		7: 29, // 7=  رجب
		8: 30, // 8=  شعبان
		9: 29, // 9= رمضان
		10: 29, // 10=  شوال
		11: 29, // 11=  ذوالقعده
		12: 30, // 12=  ذوالحجه
	},
	1447: {
		1: 29,
		2: 30,
		3: 30,
		4: 30,
		5: 30,
		6: 29,
		7: 30,
		8: 29,
		9: 30,
		10: 29,
		11: 30,
		12: 29,
	},
}

export function getShamsiEvents(
	events: FetchedAllEvents,
	selectedDate: jalaliMoment.Moment,
): FetchedEvent[] {
	const month = selectedDate.jMonth() + 1
	const day = selectedDate.jDate()
	return events.shamsiEvents.filter(
		(event) => event.month === month && event.day === day,
	)
}

// rewritten by Grok
export function convertShamsiToHijri(
	shamsiDate: jalaliMoment.Moment,
): hijriMoment.Moment {
	const referenceShamsi = jalaliMoment
		.from('1402/04/28', 'fa', 'YYYY/MM/DD')
		.startOf('day')
	const referenceHijri = { year: 1445, month: 1, day: 1 }

	const daysPassed = shamsiDate.startOf('day').diff(referenceShamsi, 'days')

	if (daysPassed < 0) {
		return hijriMoment('1445-01-01', 'iYYYY-iM-iD') // fake date to avoid crash
	}

	let remainingDays = daysPassed
	let currentYear = referenceHijri.year
	let currentMonth = referenceHijri.month
	let currentDay = referenceHijri.day

	while (remainingDays > 0) {
		if (!iranianHijriMonthDays[currentYear]) {
			// fake year to avoid crash
			currentYear = 1448
			currentMonth = 1
			currentDay = 1
			remainingDays = 0
			break
		}

		const daysInMonth = iranianHijriMonthDays[currentYear][currentMonth]

		if (remainingDays >= daysInMonth) {
			remainingDays -= daysInMonth
			currentMonth++

			if (currentMonth > 12) {
				currentMonth = 1
				currentYear++
			}
		} else {
			currentDay = remainingDays + 1
			remainingDays = 0
		}
	}

	return hijriMoment(
		`${currentYear}-${currentMonth}-${currentDay}`,
		'iYYYY-iM-iD',
	)
		.utc()
		.add(3.5, 'hours')
}

export function getHijriEvents(
	events: FetchedAllEvents,
	selectedDate: jalaliMoment.Moment,
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
	date: jalaliMoment.Moment, //  Hijri date
): FetchedEvent[] {
	const gregorianDate = date.clone().locale('en').utc().add(3.5, 'hours')

	const gregorianDay = gregorianDate.format('D')
	const gregorianMonth = gregorianDate.format('M')

	return events.gregorianEvents.filter(
		(event) => event.month === +gregorianMonth && event.day === +gregorianDay,
	)
}

export function getCurrentDate(timeZone = 'Asia/Tehran') {
	const date = new Date(new Date().toLocaleString('en-US', { timeZone }))
	return jalaliMoment(date).locale('fa').utc().add(3.5, 'hours')
}

export interface CombinedEvent {
	title: string
	isHoliday: boolean
	icon?: string | null
	source: 'shamsi' | 'gregorian' | 'hijri' | 'google'
	id?: string
	time?: string | null
	location?: string
	googleItem?: GoogleCalendarEvent
}

export function combineAndSortEvents(
	events: FetchedAllEvents,
	currentDate: WidgetifyDate,
	googleEvents: GoogleCalendarEvent[] = [],
): CombinedEvent[] {
	const shamsiEvents = getShamsiEvents(events, currentDate)
	const gregorianEvents = getGregorianEvents(events, currentDate)
	const hijriEvents = getHijriEvents(events, currentDate)
	const filteredGoogleEvents = filterGoogleEventsByDate(
		googleEvents,
		currentDate,
	)

	// All events combined
	const allEvents = [
		...shamsiEvents.map((event) => ({
			...event,
			source: 'shamsi' as const,
			time: null,
		})),
		...gregorianEvents.map((event) => ({
			...event,
			source: 'gregorian' as const,
			time: null,
		})),
		...hijriEvents.map((event) => ({
			...event,
			source: 'hijri' as const,
			time: null,
		})),
		...filteredGoogleEvents.map((event) => ({
			title: event.summary,
			isHoliday: false,
			icon: null,
			source: 'google' as const,
			id: event.id,
			time: event.start.dateTime,
			location: event.location,
			googleItem: event,
		})),
	]

	return allEvents.sort((a, b) => {
		if (a.isHoliday && !b.isHoliday) return -1
		if (!a.isHoliday && b.isHoliday) return 1

		if (a.time && b.time) {
			return new Date(a.time).getTime() - new Date(b.time).getTime()
		}

		if (a.time && !b.time) return -1
		if (!a.time && b.time) return 1

		return 0
	})
}

export function filterGoogleEventsByDate(
	events: GoogleCalendarEvent[],
	currentDate: WidgetifyDate,
): GoogleCalendarEvent[] {
	const dateStr = currentDate.clone().locale('en').format('YYYY-MM-DD')

	return events.filter((event) => {
		if (!event || !event.start || !event.start.dateTime) {
			return false
		}

		if (event.eventType === 'birthday') return false

		const eventDateStr = event.start.dateTime.split('T')[0]
		return eventDateStr === dateStr
	})
}
