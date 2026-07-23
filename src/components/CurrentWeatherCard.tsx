import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail,
  Snowflake,
  CloudLightning,
  SunDim,
  MoonStar,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Umbrella,
  Compass,
  MapPin,
  Clock,
  Zap
} from 'lucide-react';
import { WeatherData, WeatherSettings } from '../types';
import {
  getWmoInfo,
  formatTemp,
  formatSpeed,
  formatPrecip,
  convertTemp
} from '../lib/weatherUtils';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  settings: WeatherSettings;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, settings }) => {
  const { city, current, daily } = weather;
  const wmoInfo = getWmoInfo(current.weatherCode, current.isDay);

  const todayDaily = daily[0];
  const maxTemp = todayDaily ? todayDaily.tempMax : current.temperature + 3;
  const minTemp = todayDaily ? todayDaily.tempMin : current.temperature - 4;

  // Render Lucide Icon based on icon name string
  const renderWeatherIcon = (iconName: string, className: string = 'w-12 h-12') => {
    switch (iconName) {
      case 'Sun': return <Sun className={className} />;
      case 'Moon': return <Moon className={className} />;
      case 'CloudSun': return <CloudSun className={className} />;
      case 'CloudMoon': return <CloudMoon className={className} />;
      case 'Cloud': return <Cloud className={className} />;
      case 'CloudFog': return <CloudFog className={className} />;
      case 'CloudDrizzle': return <CloudDrizzle className={className} />;
      case 'CloudRain': return <CloudRain className={className} />;
      case 'CloudRainWind': return <CloudRainWind className={className} />;
      case 'CloudHail': return <CloudHail className={className} />;
      case 'Snowflake': return <Snowflake className={className} />;
      case 'CloudLightning': return <CloudLightning className={className} />;
      case 'SunDim': return <SunDim className={className} />;
      case 'MoonStar': return <MoonStar className={className} />;
      default: return <Sun className={className} />;
    }
  };

  // UV index level categorization
  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/30' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/30' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-400', badge: 'bg-orange-500/10 border-orange-500/30' };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-400', badge: 'bg-rose-500/10 border-rose-500/30' };
    return { text: 'Extreme', color: 'text-purple-400', badge: 'bg-purple-500/10 border-purple-500/30' };
  };

  const uvInfo = getUvLevel(current.uvIndex);

  // Formatting date
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Hero Weather Card */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${wmoInfo.gradientBg} text-white shadow-2xl border border-white/10 transition-all duration-500`}>
        {/* Soft background glow circles */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Location & Primary Condition */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-sky-200" />
                {city.name}
                {city.country && `, ${city.country}`}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/20 text-xs font-mono text-white/80">
                <Clock className="w-3 h-3 text-sky-200" />
                Updated {weather.fetchedAt}
              </span>
            </div>

            <p className="text-xs text-white/80 font-medium pl-1">
              {dateFormatted}
            </p>

            {/* Main Temperature Display */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter drop-shadow-md">
                {formatTemp(current.temperature, settings.tempUnit)}
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-medium text-white/90">
                  {wmoInfo.label}
                </span>
                <span className="text-xs text-white/70">
                  Feels like {formatTemp(current.feelsLike, settings.tempUnit)}
                </span>
              </div>
            </div>

            {/* High / Low Range */}
            <div className="flex items-center gap-4 text-xs font-medium text-white/90 pt-1">
              <span className="inline-flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-lg">
                <span className="text-rose-300">High:</span> {formatTemp(maxTemp, settings.tempUnit)}
              </span>
              <span className="inline-flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-lg">
                <span className="text-sky-300">Low:</span> {formatTemp(minTemp, settings.tempUnit)}
              </span>
              {todayDaily && todayDaily.precipitationProbabilityMax > 0 && (
                <span className="inline-flex items-center gap-1 bg-sky-500/20 px-2.5 py-1 rounded-lg border border-sky-300/30">
                  <Umbrella className="w-3 h-3 text-sky-200" />
                  {todayDaily.precipitationProbabilityMax}% Rain Chance
                </span>
              )}
            </div>
          </div>

          {/* Condition Weather Graphic Icon */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 self-start md:self-center shadow-lg shrink-0">
            <div className="p-3 text-amber-200 animate-pulse-subtle">
              {renderWeatherIcon(wmoInfo.icon, 'w-16 h-16 sm:w-20 sm:h-20')}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-white/90 mt-1">
              {current.isDay ? 'Daytime' : 'Nighttime'}
            </span>
          </div>

        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Humidity */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Humidity</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100">{current.humidity}%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Dew point: {formatTemp(current.dewPoint, settings.tempUnit)}
            </div>
          </div>
        </div>

        {/* Wind */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Wind</span>
            <Wind className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100">
              {formatSpeed(current.windSpeed, settings.speedUnit)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <Compass className="w-3 h-3 text-slate-500" style={{ transform: `rotate(${current.windDirection}deg)` }} />
              Direction {current.windDirection}°
            </div>
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>UV Index</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-100">{current.uvIndex.toFixed(1)}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${uvInfo.badge} ${uvInfo.color}`}>
                {uvInfo.text}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 h-full rounded-full"
                style={{ width: `${Math.min((current.uvIndex / 12) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Pressure</span>
            <Gauge className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100">
              {Math.round(current.pressure)} <span className="text-xs font-normal text-slate-400">hPa</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {current.pressure > 1013 ? 'High Pressure' : 'Low Pressure'}
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Visibility</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100">
              {current.visibility.toFixed(1)} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {current.visibility >= 10 ? 'Clear distance' : 'Reduced visibility'}
            </div>
          </div>
        </div>

        {/* Sunrise & Sunset */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Sun Horizon</span>
            <Sunrise className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 space-y-1 text-xs text-slate-200">
            {todayDaily && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sunrise className="w-3 h-3 text-amber-400" /> Rise
                  </span>
                  <span className="font-semibold">{todayDaily.sunrise || '06:15'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sunset className="w-3 h-3 text-rose-400" /> Set
                  </span>
                  <span className="font-semibold">{todayDaily.sunset || '18:45'}</span>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
