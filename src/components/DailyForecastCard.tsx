import React, { useState } from 'react';
import {
  Calendar,
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
  Umbrella,
  Wind,
  Sunrise,
  Sunset,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DailyForecastItem, WeatherSettings } from '../types';
import {
  getWmoInfo,
  formatTemp,
  convertTemp,
  formatSpeed,
  formatPrecip
} from '../lib/weatherUtils';

interface DailyForecastCardProps {
  daily: DailyForecastItem[];
  settings: WeatherSettings;
}

export const DailyForecastCard: React.FC<DailyForecastCardProps> = ({ daily, settings }) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Calculate minimum and maximum temperatures across the entire 7 days for spectrum bar
  const weekMinTemp = Math.min(...daily.map((d) => d.tempMin));
  const weekMaxTemp = Math.max(...daily.map((d) => d.tempMax));
  const tempRange = weekMaxTemp - weekMinTemp || 1;

  const renderIcon = (iconName: string) => {
    const cls = 'w-5 h-5';
    switch (iconName) {
      case 'Sun': return <Sun className={`${cls} text-amber-400`} />;
      case 'Moon': return <Moon className={`${cls} text-indigo-300`} />;
      case 'CloudSun': return <CloudSun className={`${cls} text-amber-300`} />;
      case 'CloudMoon': return <CloudMoon className={`${cls} text-indigo-300`} />;
      case 'Cloud': return <Cloud className={`${cls} text-slate-300`} />;
      case 'CloudFog': return <CloudFog className={`${cls} text-slate-400`} />;
      case 'CloudDrizzle': return <CloudDrizzle className={`${cls} text-cyan-400`} />;
      case 'CloudRain': return <CloudRain className={`${cls} text-blue-400`} />;
      case 'CloudRainWind': return <CloudRainWind className={`${cls} text-indigo-400`} />;
      case 'CloudHail': return <CloudHail className={`${cls} text-cyan-300`} />;
      case 'Snowflake': return <Snowflake className={`${cls} text-sky-200`} />;
      case 'CloudLightning': return <CloudLightning className={`${cls} text-purple-400`} />;
      default: return <Sun className={`${cls} text-amber-400`} />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            7-Day Forecast Outlook
          </h2>
          <p className="text-xs text-slate-400">
            Weekly temperature spectrum, rain risk, and atmospheric overview
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-800/60">
        {daily.slice(0, 7).map((item) => {
          const wmo = getWmoInfo(item.weatherCode, true);
          const isExpanded = expandedDate === item.date;

          // Calculate visual left offset % and width % for temperature spectrum bar
          const leftOffset = Math.max(0, ((item.tempMin - weekMinTemp) / tempRange) * 100);
          const barWidth = Math.max(8, ((item.tempMax - item.tempMin) / tempRange) * 100);

          return (
            <div key={item.date} className="py-3 transition">
              <div
                onClick={() => setExpandedDate(isExpanded ? null : item.date)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group hover:bg-slate-800/40 p-2.5 rounded-2xl transition"
              >
                {/* Day & Icon */}
                <div className="flex items-center gap-3 min-w-[170px]">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 group-hover:border-slate-600">
                    {renderIcon(wmo.icon)}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-100 block">
                      {item.dayName}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[110px] block">
                      {wmo.label}
                    </span>
                  </div>
                </div>

                {/* Rain probability badge */}
                <div className="flex items-center gap-2 min-w-[90px]">
                  {item.precipitationProbabilityMax > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-medium border border-sky-500/20">
                      <Umbrella className="w-3 h-3" />
                      {item.precipitationProbabilityMax}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 pl-1">0% rain</span>
                  )}
                </div>

                {/* Temperature Spectrum Bar */}
                <div className="flex-1 flex items-center gap-3 min-w-[180px] max-w-xs">
                  <span className="text-xs font-semibold text-slate-400 text-right w-8">
                    {formatTemp(item.tempMin, settings.tempUnit)}
                  </span>
                  
                  <div className="flex-1 bg-slate-800 h-2.5 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 shadow-sm"
                      style={{
                        left: `${leftOffset}%`,
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-semibold text-slate-100 w-8">
                    {formatTemp(item.tempMax, settings.tempUnit)}
                  </span>
                </div>

                {/* Chevron */}
                <div className="text-slate-500 group-hover:text-slate-300">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Detailed Day Stats */}
              {isExpanded && (
                <div className="mt-2 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300 animate-fade-in">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Precipitation Sum</span>
                    <span className="font-semibold text-sky-300">
                      {formatPrecip(item.precipitationSum, settings.precipUnit)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Max Wind Peak</span>
                    <span className="font-semibold text-teal-300 flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5" />
                      {formatSpeed(item.windSpeedMax, settings.speedUnit)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">UV Max Index</span>
                    <span className="font-semibold text-amber-300">
                      {item.uvIndexMax.toFixed(1)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Sun Schedule</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <Sunrise className="w-3.5 h-3.5 text-amber-400" /> {item.sunrise}
                      <Sunset className="w-3.5 h-3.5 text-rose-400" /> {item.sunset}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
