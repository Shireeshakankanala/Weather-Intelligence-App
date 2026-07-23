import {
  GeoCity,
  WeatherData,
  CurrentWeatherData,
  HourlyForecastItem,
  DailyForecastItem,
  WeatherAIIntelligence,
  TemperatureUnit,
  SpeedUnit,
  DistanceUnit
} from '../types';

// Default initial cities for quick picking
export const POPULAR_CITIES: GeoCity[] = [
  { id: 1, name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', country_code: 'JP', timezone: 'Asia/Tokyo' },
  { id: 2, name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'United States', country_code: 'US', admin1: 'New York', timezone: 'America/New_York' },
  { id: 3, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', country_code: 'GB', timezone: 'Europe/London' },
  { id: 4, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France', country_code: 'FR', timezone: 'Europe/Paris' },
  { id: 5, name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia', country_code: 'AU', timezone: 'Australia/Sydney' },
  { id: 6, name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'United Arab Emirates', country_code: 'AE', timezone: 'Asia/Dubai' },
  { id: 7, name: 'Singapore', latitude: 1.3521, longitude: 103.8198, country: 'Singapore', country_code: 'SG', timezone: 'Asia/Singapore' },
  { id: 8, name: 'Zurich', latitude: 47.3769, longitude: 8.5417, country: 'Switzerland', country_code: 'CH', timezone: 'Europe/Zurich' },
];

export interface WmoCodeInfo {
  label: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  icon: string;
  gradientBg: string; // Tailwind class
  accentBg: string;
}

export function getWmoInfo(code: number, isDay: boolean = true): WmoCodeInfo {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Sunny & Clear' : 'Clear Night',
        category: 'clear',
        icon: isDay ? 'Sun' : 'Moon',
        gradientBg: isDay
          ? 'from-sky-400 via-blue-500 to-amber-200'
          : 'from-slate-900 via-indigo-950 to-slate-800',
        accentBg: 'bg-amber-500/10 text-amber-600 border-amber-200'
      };
    case 1:
      return {
        label: 'Mainly Clear',
        category: 'clear',
        icon: isDay ? 'SunDim' : 'MoonStar',
        gradientBg: isDay
          ? 'from-sky-300 via-sky-500 to-indigo-300'
          : 'from-slate-900 via-slate-800 to-indigo-950',
        accentBg: 'bg-sky-500/10 text-sky-600 border-sky-200'
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        category: 'cloudy',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        gradientBg: isDay
          ? 'from-blue-400 via-sky-400 to-slate-200'
          : 'from-slate-900 via-slate-800 to-slate-900',
        accentBg: 'bg-blue-500/10 text-blue-600 border-blue-200'
      };
    case 3:
      return {
        label: 'Overcast Sky',
        category: 'cloudy',
        icon: 'Cloud',
        gradientBg: 'from-slate-500 via-slate-600 to-gray-400',
        accentBg: 'bg-slate-500/10 text-slate-700 border-slate-300'
      };
    case 45:
    case 48:
      return {
        label: 'Foggy Conditions',
        category: 'fog',
        icon: 'CloudFog',
        gradientBg: 'from-slate-400 via-gray-500 to-zinc-400',
        accentBg: 'bg-zinc-500/10 text-zinc-700 border-zinc-300'
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Light Drizzle',
        category: 'drizzle',
        icon: 'CloudDrizzle',
        gradientBg: 'from-cyan-600 via-blue-600 to-slate-600',
        accentBg: 'bg-cyan-500/10 text-cyan-700 border-cyan-300'
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        category: 'drizzle',
        icon: 'CloudHail',
        gradientBg: 'from-blue-700 via-cyan-800 to-slate-700',
        accentBg: 'bg-cyan-500/10 text-cyan-800 border-cyan-400'
      };
    case 61:
      return {
        label: 'Slight Rain',
        category: 'rain',
        icon: 'CloudRain',
        gradientBg: 'from-blue-600 via-sky-700 to-slate-700',
        accentBg: 'bg-blue-500/10 text-blue-700 border-blue-300'
      };
    case 63:
      return {
        label: 'Moderate Rain',
        category: 'rain',
        icon: 'CloudRain',
        gradientBg: 'from-blue-700 via-indigo-800 to-slate-800',
        accentBg: 'bg-blue-600/10 text-blue-800 border-blue-400'
      };
    case 65:
      return {
        label: 'Heavy Rain',
        category: 'rain',
        icon: 'CloudRainWind',
        gradientBg: 'from-indigo-900 via-slate-900 to-blue-950',
        accentBg: 'bg-indigo-500/10 text-indigo-700 border-indigo-300'
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        category: 'rain',
        icon: 'CloudHail',
        gradientBg: 'from-slate-800 via-cyan-900 to-blue-900',
        accentBg: 'bg-cyan-600/10 text-cyan-700 border-cyan-300'
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: 'Snowfall',
        category: 'snow',
        icon: 'Snowflake',
        gradientBg: 'from-slate-300 via-blue-200 to-indigo-100',
        accentBg: 'bg-blue-400/10 text-blue-600 border-blue-200'
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        category: 'rain',
        icon: 'CloudRain',
        gradientBg: 'from-sky-600 via-blue-700 to-indigo-800',
        accentBg: 'bg-sky-500/10 text-sky-700 border-sky-300'
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        category: 'snow',
        icon: 'Snowflake',
        gradientBg: 'from-indigo-300 via-sky-200 to-slate-200',
        accentBg: 'bg-indigo-400/10 text-indigo-700 border-indigo-200'
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        category: 'thunderstorm',
        icon: 'CloudLightning',
        gradientBg: 'from-slate-900 via-purple-950 to-zinc-900',
        accentBg: 'bg-purple-500/10 text-purple-600 border-purple-300'
      };
    default:
      return {
        label: 'Variable Sky',
        category: 'clear',
        icon: 'Sun',
        gradientBg: 'from-sky-400 to-blue-600',
        accentBg: 'bg-sky-500/10 text-sky-600 border-sky-200'
      };
  }
}

// Unit conversions
export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    return `${Math.round((celsius * 9) / 5 + 32)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function convertTemp(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatSpeed(kmh: number, unit: SpeedUnit): string {
  if (unit === 'mph') {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  if (unit === 'ms') {
    return `${(kmh / 3.6).toFixed(1)} m/s`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPrecip(mm: number, unit: DistanceUnit): string {
  if (unit === 'inch') {
    return `${(mm * 0.0393701).toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

// Geocoding API Search
export async function searchCities(query: string): Promise<GeoCity[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=10&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to search cities');
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('Geocoding error:', err);
    return [];
  }
}

// Reverse geocoding for Current Location
export async function getCityByCoords(lat: number, lng: number): Promise<GeoCity> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lng.toFixed(
      2
    )}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }
    }
  } catch {
    // ignore
  }
  return {
    id: Date.now(),
    name: 'Your Location',
    latitude: lat,
    longitude: lng,
    country: 'Local',
  };
}

// Fetch complete Open-Meteo weather data
export async function fetchWeatherData(city: GeoCity): Promise<WeatherData> {
  const { latitude, longitude } = city;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,wind_speed_10m,uv_index,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.statusText}`);
  const data = await res.json();

  const current: CurrentWeatherData = {
    time: data.current.time,
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    weatherCode: data.current.weather_code,
    pressure: data.current.surface_pressure,
    uvIndex: data.hourly?.uv_index ? data.hourly.uv_index[0] || 0 : 0,
    visibility: data.hourly?.visibility ? data.hourly.visibility[0] / 1000 : 10, // in km
    dewPoint: data.hourly?.dew_point_2m ? data.hourly.dew_point_2m[0] : 10,
    isDay: data.current.is_day === 1,
  };

  // Find current hour index to get 24-hour window from now
  const hourlyTimes: string[] = data.hourly.time || [];
  const nowIso = new Date().toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
  let startIndex = hourlyTimes.findIndex((t) => t.startsWith(nowIso));
  if (startIndex < 0) startIndex = 0;

  const hourly: HourlyForecastItem[] = hourlyTimes
    .slice(startIndex, startIndex + 24)
    .map((timeStr, idx) => {
      const realIdx = startIndex + idx;
      return {
        time: timeStr,
        temperature: data.hourly.temperature_2m[realIdx] ?? 0,
        feelsLike: data.hourly.apparent_temperature[realIdx] ?? 0,
        weatherCode: data.hourly.weather_code[realIdx] ?? 0,
        precipitationProbability: data.hourly.precipitation_probability[realIdx] ?? 0,
        precipitation: data.hourly.precipitation[realIdx] ?? 0,
        windSpeed: data.hourly.wind_speed_10m[realIdx] ?? 0,
        humidity: data.hourly.relative_humidity_2m[realIdx] ?? 0,
        uvIndex: data.hourly.uv_index[realIdx] ?? 0,
      };
    });

  const dailyTimes: string[] = data.daily.time || [];
  const daily: DailyForecastItem[] = dailyTimes.map((dateStr, idx) => {
    const d = new Date(dateStr);
    const today = new Date().toISOString().slice(0, 10);
    let dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    if (dateStr === today) dayName = 'Today';

    return {
      date: dateStr,
      dayName,
      weatherCode: data.daily.weather_code[idx],
      tempMax: data.daily.temperature_2m_max[idx],
      tempMin: data.daily.temperature_2m_min[idx],
      precipitationSum: data.daily.precipitation_sum[idx] || 0,
      precipitationProbabilityMax: data.daily.precipitation_probability_max[idx] || 0,
      windSpeedMax: data.daily.wind_speed_10m_max[idx] || 0,
      uvIndexMax: data.daily.uv_index_max[idx] || 0,
      sunrise: data.daily.sunrise[idx] ? data.daily.sunrise[idx].split('T')[1] : '',
      sunset: data.daily.sunset[idx] ? data.daily.sunset[idx].split('T')[1] : '',
    };
  });

  return {
    city,
    current,
    hourly,
    daily,
    fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

// Call backend Gemini AI Weather Intelligence API
export async function fetchWeatherAIIntelligence(
  weather: WeatherData,
  unit: TemperatureUnit,
  userScenario?: string
): Promise<WeatherAIIntelligence> {
  const currentInfo = getWmoInfo(weather.current.weatherCode, weather.current.isDay);
  const maxTemp = Math.max(...weather.hourly.map((h) => h.temperature));
  const minTemp = Math.min(...weather.hourly.map((h) => h.temperature));
  const rainProb = Math.max(...weather.hourly.slice(0, 12).map((h) => h.precipitationProbability));

  const body = {
    city: `${weather.city.name}${weather.city.country ? `, ${weather.city.country}` : ''}`,
    currentTemp: weather.current.temperature,
    unit,
    condition: currentInfo.label,
    humidity: weather.current.humidity,
    windSpeed: weather.current.windSpeed,
    uvIndex: weather.current.uvIndex,
    maxTemp,
    minTemp,
    rainProb,
    forecast7DaySummary: weather.daily.slice(0, 5).map((d) => ({
      day: d.dayName,
      max: d.tempMax,
      min: d.tempMin,
      rainProbMax: d.precipitationProbabilityMax,
    })),
    userScenario,
  };

  const res = await fetch('/api/weather-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error('AI Weather endpoint failed');
  }

  const result = await res.json();
  return result.data;
}
