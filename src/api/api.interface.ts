export interface Timezone {
	label: string
	value: string
	offset: string
}

export interface FetchedEvent {
	isHoliday: boolean
	title: string
	day: number
	month: number
}
export interface FetchedAllEvents {
	shamsiEvents: FetchedEvent[]
	gregorianEvents: FetchedEvent[]
	hijriEvents: FetchedEvent[]
}

export interface News {
	title: string
	url: string | null
	icon: string | null
	isPin?: boolean
}
