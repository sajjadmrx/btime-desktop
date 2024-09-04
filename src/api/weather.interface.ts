export interface WeatherResponse {
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

export interface ForecastResponse {
  temp: number
  icon: string
  date: string
}
