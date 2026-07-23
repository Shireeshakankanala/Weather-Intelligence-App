import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  RefreshCw,
  Sliders,
  Star,
  Compass,
  X,
  Sparkles,
  CloudSun
} from 'lucide-react';
import { GeoCity, WeatherSettings, TemperatureUnit, SpeedUnit } from '../types';
import { POPULAR_CITIES, searchCities, getCityByCoords } from '../lib/weatherUtils';

interface NavbarProps {
  currentCity: GeoCity;
  onSelectCity: (city: GeoCity) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  settings: WeatherSettings;
  onUpdateSettings: (newSettings: Partial<WeatherSettings>) => void;
  favorites: GeoCity[];
  onToggleFavorite: (city: GeoCity) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onSelectCity,
  onRefresh,
  isRefreshing,
  settings,
  onUpdateSettings,
  favorites,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced geocoding search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchCities(query);
      setSearchResults(results);
      setIsSearching(false);
      setShowDropdown(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectCityItem = (city: GeoCity) => {
    onSelectCity(city);
    setQuery('');
    setShowDropdown(false);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const city = await getCityByCoords(latitude, longitude);
        onSelectCity(city);
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        alert('Could not determine current location. Please select a city manually.');
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const isCurrentFavorite = favorites.some((f) => f.id === currentCity.id || (f.name === currentCity.name && f.country === currentCity.country));

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectCity(POPULAR_CITIES[0])}>
              <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                <CloudSun className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent">
                  SkyPulse
                </span>
                <span className="text-[10px] font-medium tracking-wide uppercase block text-sky-400 -mt-1">
                  Weather Intelligence
                </span>
              </div>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Refresh Weather"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Box with Autocomplete */}
          <div className="relative flex-1 max-w-lg w-full" ref={searchRef}>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search city, e.g. Tokyo, London, San Francisco..."
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition shadow-inner"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSearchResults([]);
                  }}
                  className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showDropdown && (
              <div className="absolute left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto divide-y divide-slate-700/50">
                {isSearching ? (
                  <div className="px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                    Searching cities...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((city) => (
                    <button
                      key={`${city.id}-${city.latitude}`}
                      onClick={() => handleSelectCityItem(city)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-700/80 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-slate-100">{city.name}</span>
                        {city.admin1 && <span className="text-xs text-slate-400">{city.admin1},</span>}
                        {city.country && <span className="text-xs text-slate-400">{city.country}</span>}
                      </div>
                      {city.population && (
                        <span className="text-[11px] text-slate-500">
                          Pop. {(city.population / 1000).toFixed(0)}k
                        </span>
                      )}
                    </button>
                  ))
                ) : query.trim().length >= 2 ? (
                  <div className="px-4 py-3 text-sm text-slate-400">
                    No matching cities found for &quot;{query}&quot;.
                  </div>
                ) : (
                  <div className="p-3">
                    <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2 px-1">
                      Popular Destinations
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {POPULAR_CITIES.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleSelectCityItem(city)}
                          className="text-left px-2.5 py-1.5 rounded-lg text-xs bg-slate-700/40 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5"
                        >
                          <Compass className="w-3 h-3 text-sky-400" />
                          <span className="truncate">{city.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons & Unit Toggles */}
          <div className="hidden md:flex items-center gap-2">
            {/* Location button */}
            <button
              onClick={handleCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 transition"
              title="Use Current Location"
            >
              <MapPin className={`w-3.5 h-3.5 text-sky-400 ${isLocating ? 'animate-bounce' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'My Location'}</span>
            </button>

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(currentCity)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                isCurrentFavorite
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700/60 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isCurrentFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isCurrentFavorite ? 'Saved' : 'Save'}</span>
            </button>

            {/* Unit Toggle Pill */}
            <div className="flex items-center bg-slate-800 border border-slate-700/80 rounded-lg p-0.5">
              <button
                onClick={() => onUpdateSettings({ tempUnit: 'celsius' })}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  settings.tempUnit === 'celsius'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => onUpdateSettings({ tempUnit: 'fahrenheit' })}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  settings.tempUnit === 'fahrenheit'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °F
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            {/* Settings modal trigger */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
              title="Unit & Display Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Quick Favorites Bar */}
        {favorites.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 shrink-0">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Favorites:
            </span>
            {favorites.map((fav) => (
              <button
                key={`${fav.id}-${fav.name}`}
                onClick={() => onSelectCity(fav)}
                className={`px-2.5 py-0.5 rounded-full text-xs shrink-0 border transition ${
                  currentCity.name === fav.name
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-medium'
                    : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {fav.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-400" /> Weather Preferences
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 my-5 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                  Temperature Scale
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateSettings({ tempUnit: 'celsius' })}
                    className={`p-3 rounded-xl border text-center font-medium transition ${
                      settings.tempUnit === 'celsius'
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    Celsius (°C)
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ tempUnit: 'fahrenheit' })}
                    className={`p-3 rounded-xl border text-center font-medium transition ${
                      settings.tempUnit === 'fahrenheit'
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                  Wind Speed Unit
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['kmh', 'mph', 'ms'] as SpeedUnit[]).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => onUpdateSettings({ speedUnit: unit })}
                      className={`p-2.5 rounded-xl border text-center font-medium text-xs transition ${
                        settings.speedUnit === unit
                          ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {unit === 'kmh' ? 'km/h' : unit === 'mph' ? 'mph' : 'm/s'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                  Precipitation Unit
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateSettings({ precipUnit: 'mm' })}
                    className={`p-3 rounded-xl border text-center font-medium text-xs transition ${
                      settings.precipUnit === 'mm'
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    Millimeters (mm)
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ precipUnit: 'inch' })}
                    className={`p-3 rounded-xl border text-center font-medium text-xs transition ${
                      settings.precipUnit === 'inch'
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    Inches (in)
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 font-semibold text-slate-950 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
