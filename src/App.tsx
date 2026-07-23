import React, { useState, useEffect, useCallback } from 'react';
import {
  GeoCity,
  WeatherData,
  WeatherAIIntelligence,
  WeatherSettings,
} from './types';
import {
  POPULAR_CITIES,
  fetchWeatherData,
  fetchWeatherAIIntelligence,
} from './lib/weatherUtils';
import { Navbar } from './components/Navbar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecastCard } from './components/DailyForecastCard';
import { WeatherIntelligenceCard } from './components/WeatherIntelligenceCard';
import { AlertCircle, RefreshCw, CloudSun, MapPin } from 'lucide-react';

export default function App() {
  // Settings State with LocalStorage Persistence
  const [settings, setSettings] = useState<WeatherSettings>(() => {
    const saved = localStorage.getItem('skypulse_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      tempUnit: 'celsius',
      speedUnit: 'kmh',
      precipUnit: 'mm',
      themeMode: 'auto',
    };
  });

  // Save Settings
  useEffect(() => {
    localStorage.setItem('skypulse_settings', JSON.stringify(settings));
  }, [settings]);

  // Favorites state with persistence
  const [favorites, setFavorites] = useState<GeoCity[]>(() => {
    const saved = localStorage.getItem('skypulse_favorites');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [POPULAR_CITIES[0], POPULAR_CITIES[1], POPULAR_CITIES[2]];
  });

  useEffect(() => {
    localStorage.setItem('skypulse_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Current selected city
  const [currentCity, setCurrentCity] = useState<GeoCity>(POPULAR_CITIES[0]);

  // Weather and AI state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [aiIntelligence, setAiIntelligence] = useState<WeatherAIIntelligence | null>(null);

  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load weather for city
  const loadWeather = useCallback(async (city: GeoCity) => {
    setIsLoadingWeather(true);
    setError(null);
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
      setIsLoadingWeather(false);

      // Immediately fetch AI intelligence for this weather
      setIsLoadingAI(true);
      try {
        const intel = await fetchWeatherAIIntelligence(data, settings.tempUnit);
        setAiIntelligence(intel);
      } catch (err: any) {
        console.error('AI fetch error:', err);
      } finally {
        setIsLoadingAI(false);
      }
    } catch (err: any) {
      console.error('Weather load error:', err);
      setError(err?.message || 'Failed to fetch weather data from Open-Meteo');
      setIsLoadingWeather(false);
    }
  }, [settings.tempUnit]);

  // Initial load
  useEffect(() => {
    loadWeather(currentCity);
  }, [currentCity, loadWeather]);

  // Refresh AI Intelligence (e.g. for custom scenario)
  const handleRefreshAI = async (userScenario?: string) => {
    if (!weatherData) return;
    setIsLoadingAI(true);
    try {
      const intel = await fetchWeatherAIIntelligence(weatherData, settings.tempUnit, userScenario);
      setAiIntelligence(intel);
    } catch (err: any) {
      console.error('AI Refresh Error:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Toggle favorite city
  const handleToggleFavorite = (cityToToggle: GeoCity) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === cityToToggle.id || (f.name === cityToToggle.name && f.country === cityToToggle.country));
      if (exists) {
        return prev.filter((f) => !(f.id === cityToToggle.id || (f.name === cityToToggle.name && f.country === cityToToggle.country)));
      } else {
        return [...prev, cityToToggle];
      }
    });
  };

  const handleUpdateSettings = (newSettings: Partial<WeatherSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950">
      
      {/* Sticky Header Navbar */}
      <Navbar
        currentCity={currentCity}
        onSelectCity={(city) => setCurrentCity(city)}
        onRefresh={() => loadWeather(currentCity)}
        isRefreshing={isLoadingWeather}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* Error Alert Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadWeather(currentCity)}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 font-semibold text-xs transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton or Main Content */}
        {isLoadingWeather && !weatherData ? (
          <div className="space-y-6">
            <div className="h-64 rounded-3xl bg-slate-900 animate-pulse border border-slate-800" />
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
              ))}
            </div>
            <div className="h-72 rounded-3xl bg-slate-900 animate-pulse border border-slate-800" />
          </div>
        ) : weatherData ? (
          <div className="space-y-8 animate-fade-in">

            {/* 1. Hero Current Weather & Key Metrics */}
            <CurrentWeatherCard
              weather={weatherData}
              settings={settings}
            />

            {/* 2. Weather Intelligence & AI Planning Recommendations */}
            <WeatherIntelligenceCard
              weather={weatherData}
              intelligence={aiIntelligence}
              isLoading={isLoadingAI}
              onRefreshIntelligence={handleRefreshAI}
              settings={settings}
            />

            {/* 3. Interactive 24-Hour Forecast & Recharts Trends */}
            <HourlyForecast
              hourly={weatherData.hourly}
              settings={settings}
            />

            {/* 4. 7-Day Outlook & Spectrum Bars */}
            <DailyForecastCard
              daily={weatherData.daily}
              settings={settings}
            />

          </div>
        ) : null}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-400">SkyPulse Weather Intelligence</span>
          </div>
          <div>
            Powered by <span className="text-slate-400 font-medium">Open-Meteo API</span> & <span className="text-sky-400 font-medium">Google Gemini 3.6 Flash</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
