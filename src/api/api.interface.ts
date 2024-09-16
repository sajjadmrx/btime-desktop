export interface Timezone {
  label: string
  value: string
  offset: string
}
export interface TodayEvent {
  isHoliday: boolean
  title: string
  gif: string | null
}

export interface News {
  title: string
  url: string | null
  icon: string | null
  isPin?: boolean
}
