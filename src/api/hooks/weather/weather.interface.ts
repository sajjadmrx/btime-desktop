export interface FetchedWeather {
	city: {
		fa: string
		en: string
	}
	weather: {
		label: string
		description: {
			text: string
			emoji: string
		}
		icon: {
			url: string
			width: number
			height: number
		}
		temperature: {
			clouds: number
			humidity: number
			pressure: number
			temp: number
			temp_description: string
			temp_max: number
			temp_min: number
			wind_speed: number
		}
	}
}

export type TemperatureUnit = 'standard' | 'metric' | 'imperial'

export interface ForecastResponse {
	temp: number
	icon: string
	date: string
}

export interface FetchedForecast {
	temp: number
	icon: string
	date: string
}
