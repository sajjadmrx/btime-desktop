import { useMemo } from 'react'
import { FaGoogle } from 'react-icons/fa'
import {
	FiCalendar,
	FiChevronRight,
	FiClock,
	FiGlobe,
	FiMoon,
} from 'react-icons/fi'
import { HiLocationMarker } from 'react-icons/hi'
import type { GoogleCalendarEvent } from '../../../api/hooks/events/getGoogleCalendarEvents.hook'

export interface CombinedEvent {
	title: string
	isHoliday: boolean
	icon?: string | null
	source: 'shamsi' | 'gregorian' | 'hijri' | 'google'
	id?: string
	time?: string | null
	location?: string
	googleItem?: GoogleCalendarEvent
	startTime?: string
	endTime?: string
	description?: string
}

interface EventCardProps {
	event: CombinedEvent
}

export const EventCard = ({ event }: EventCardProps) => {
	const getSourceIcon = () => {
		switch (event.source) {
			case 'google':
				return <FaGoogle className="text-blue-500" size={12} />
			case 'gregorian':
				return <FiGlobe className="text-green-400" size={12} />
			case 'hijri':
				return <FiMoon className="text-blue-400" size={12} />
			default: // shamsi
				return <FiCalendar className="text-blue-400" size={12} />
		}
	}

	const getSourceBgColor = () => {
		switch (event.source) {
			case 'google':
				return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600/80 dark:text-blue-400/80'
			case 'gregorian':
				return 'bg-green-100 dark:bg-green-900/30 text-green-600/80 dark:text-green-400/80'
			case 'hijri':
				return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600/80 dark:text-blue-400/80'
			default: // shamsi
				return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600/80 dark:text-blue-400/80'
		}
	}

	const formattedTime = useMemo(() => {
		if (event.googleItem?.start?.dateTime) {
			try {
				const startTime = new Date(event.googleItem.start.dateTime)
				const endTime = new Date(event.googleItem.end.dateTime)
				return `${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')} - ${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`
			} catch (e) {}
		}

		if (!event.startTime && !event.time) return null
		const timeString = event.startTime || event.time

		if (typeof timeString === 'string' && timeString.includes(':')) {
			return timeString
		}

		if (event.startTime && event.endTime) {
			return `${event.startTime} - ${event.endTime}`
		}

		return timeString
	}, [event.startTime, event.endTime, event.time, event.googleItem])

	const location = event.location || event.googleItem?.location

	return (
		<div
			className={` rounded-lg overflow-hidden bg-gray-100/50 dark:bg-gray-800/60 backdrop-blur-sm border-r ${event.isHoliday ? 'border-red-500' : event.source === 'google' ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}
			dir="rtl"
		>
			<div className="p-1">
				<div className="flex items-center mb-0.5">
					<h4 className="text-sm font-medium text-gray-700 grow text-wrap dark:text-gray-200">
						{event.title}
					</h4>
					<div className="flex gap-1 mr-1">
						{event.isHoliday && (
							<span className="text-xs px-2 py-0.5 rounded-md bg-red-100 text-red-600/60 dark:bg-red-900/30 dark:text-red-400">
								تعطیل
							</span>
						)}
						{event.source === 'google' && event.googleItem?.htmlLink && (
							<button
								onClick={() =>
									window.ipcMain.openUrl(event.googleItem?.htmlLink)
								}
								className="p-1 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
							>
								<FiChevronRight
									size={16}
									className="text-gray-500 dark:text-gray-400"
								/>
							</button>
						)}
						<span
							className={`text-xs flex items-center px-1.5 py-1.5 rounded-full ${getSourceBgColor()}`}
						>
							{getSourceIcon()}
						</span>
					</div>
				</div>
				{formattedTime && (
					<div className="flex items-center">
						<FiClock size={12} className="text-gray-500 dark:text-gray-400" />
						<span className="mr-1 text-xs text-gray-500 dark:text-gray-400">
							{formattedTime}
						</span>
					</div>
				)}{' '}
				{location && (
					<div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
						<div className="flex items-center">
							<HiLocationMarker className="ml-1 w-3.5 h-3.5" />
							<span className="block truncate">{location}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
