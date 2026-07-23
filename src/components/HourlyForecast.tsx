import React, { useState } from 'react';
import {
  Clock,
  TrendingUp,
  BarChart3,
  Umbrella,
  Wind,
  Sun,
  CloudRain,
  Cloud,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { HourlyForecastItem, WeatherSettings } from '../types';
import {
  getWmoInfo,
  formatTemp,
  convertTemp,
  formatSpeed
} from '../lib/weatherUtils';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  settings: WeatherSettings;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, settings }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'tempChart' | 'rainChart' | 'windChart'>('timeline');
  const [selectedHour, setSelectedHour] = useState<HourlyForecastItem | null>(null);

  // Format data for Recharts
  const chartData = hourly.map((item) => {
    const dateObj = new Date(item.time);
    const hourLabel = dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    return {
      timeLabel: hourLabel,
      temp: convertTemp(item.temperature, settings.tempUnit),
      rainProb: item.precipitationProbability,
      wind: item.windSpeed,
      humidity: item.humidity,
      uvIndex: item.uvIndex,
      rawItem: item,
    };
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" />
            24-Hour Forecast
          </h2>
          <p className="text-xs text-slate-400">
            Hourly progression, precipitation risk, and trend charts
          </p>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'timeline'
                ? 'bg-sky-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('tempChart')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'tempChart'
                ? 'bg-sky-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Temp Curve
          </button>
          <button
            onClick={() => setActiveTab('rainChart')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'rainChart'
                ? 'bg-sky-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Umbrella className="w-3.5 h-3.5" />
            Rain %
          </button>
          <button
            onClick={() => setActiveTab('windChart')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'windChart'
                ? 'bg-sky-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Wind
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'timeline' && (
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar">
            {hourly.map((item, idx) => {
              const wmo = getWmoInfo(item.weatherCode, true);
              const dateObj = new Date(item.time);
              const hourLabel = idx === 0 ? 'Now' : dateObj.toLocaleTimeString([], { hour: 'numeric' });
              const isSelected = selectedHour?.time === item.time;

              return (
                <button
                  key={item.time}
                  onClick={() => setSelectedHour(isSelected ? null : item)}
                  className={`flex flex-col items-center justify-between p-3.5 rounded-2xl min-w-[85px] border snap-start transition-all duration-200 ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 ring-2 ring-sky-400/30 scale-105 shadow-lg'
                      : idx === 0
                      ? 'bg-slate-800/90 border-slate-700 text-slate-100'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 text-slate-300'
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-400">{hourLabel}</span>

                  <div className="my-2 text-sky-300">
                    <span className="text-xs font-medium text-slate-200 truncate max-w-[70px] block">
                      {formatTemp(item.temperature, settings.tempUnit)}
                    </span>
                  </div>

                  {/* Precipitation Probability Indicator */}
                  {item.precipitationProbability > 0 ? (
                    <div className="flex items-center gap-1 text-[11px] text-sky-400 font-medium">
                      <Umbrella className="w-3 h-3" />
                      <span>{item.precipitationProbability}%</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500">
                      0% rain
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Hour Modal / Drawer if selected */}
          {selectedHour && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-100">
                    Detailed Weather for {new Date(selectedHour.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', weekday: 'short' })}
                  </div>
                  <div className="text-xs text-slate-400">
                    Condition: {getWmoInfo(selectedHour.weatherCode).label}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Temperature</span>
                  <span className="font-semibold text-slate-100">{formatTemp(selectedHour.temperature, settings.tempUnit)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Rain Probability</span>
                  <span className="font-semibold text-sky-400">{selectedHour.precipitationProbability}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Wind Speed</span>
                  <span className="font-semibold text-teal-400">{formatSpeed(selectedHour.windSpeed, settings.speedUnit)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Humidity</span>
                  <span className="font-semibold text-indigo-400">{selectedHour.humidity}%</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedHour(null)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

      {/* Temperature Area Chart */}
      {activeTab === 'tempChart' && (
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="°" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                formatter={(val: any) => [`${val}° ${settings.tempUnit === 'fahrenheit' ? 'F' : 'C'}`, 'Temperature']}
              />
              <Area type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Rain Probability Bar Chart */}
      {activeTab === 'rainChart' && (
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                formatter={(val: any) => [`${val}%`, 'Rain Chance']}
              />
              <Bar dataKey="rainProb" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Wind Chart */}
      {activeTab === 'windChart' && (
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                formatter={(val: any) => [`${formatSpeed(val, settings.speedUnit)}`, 'Wind Speed']}
              />
              <Area type="monotone" dataKey="wind" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#windGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
