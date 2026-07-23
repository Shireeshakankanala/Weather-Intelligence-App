export interface GeoCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string; // State / Region
  timezone?: string;
  population?: number;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kmh' | 'mph' | 'ms';
export type DistanceUnit = 'mm' | 'inch';

export interface WeatherSettings {
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  precipUnit: DistanceUnit;
  themeMode: 'auto' | 'light' | 'dark';
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  dewPoint: number;
  isDay: boolean;
}

export interface HourlyForecastItem {
  time: string; // ISO string or formatted hour
  temperature: number;
  feelsLike: number;
  weatherCode: number;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
  uvIndex: number;
}

export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  dayName: string; // e.g. "Mon", "Today"
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  city: GeoCity;
  current: CurrentWeatherData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  fetchedAt: string;
}

export interface ActivityRecommendation {
  activity: string;
  score: number; // 0 - 100
  status: 'Ideal' | 'Great' | 'Caution' | 'Avoid';
  reason: string;
}

export interface HourlyTip {
  timeFrame: string;
  tip: string;
}

export interface WeatherAIIntelligence {
  summary: string;
  outfitAdvice: string;
  activityRecommendations: ActivityRecommendation[];
  hourlyTips: HourlyTip[];
  customPlanFeedback: string;
  travelPackingEssentials: string[];
}
