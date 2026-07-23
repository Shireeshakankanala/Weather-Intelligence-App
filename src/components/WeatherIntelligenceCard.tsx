import React, { useState } from 'react';
import {
  Sparkles,
  Shirt,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Send,
  Luggage,
  Clock,
  Compass,
  ThumbsUp,
  RefreshCw,
  Umbrella,
  Sun,
  Wind,
  Footprints,
  Layers
} from 'lucide-react';
import { WeatherData, WeatherAIIntelligence, WeatherSettings } from '../types';
import { fetchWeatherAIIntelligence } from '../lib/weatherUtils';

interface WeatherIntelligenceCardProps {
  weather: WeatherData;
  intelligence: WeatherAIIntelligence | null;
  isLoading: boolean;
  onRefreshIntelligence: (scenario?: string) => void;
  settings: WeatherSettings;
}

export const WeatherIntelligenceCard: React.FC<WeatherIntelligenceCardProps> = ({
  weather,
  intelligence,
  isLoading,
  onRefreshIntelligence,
  settings,
}) => {
  const [customScenario, setCustomScenario] = useState('');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleCustomPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customScenario.trim()) return;
    onRefreshIntelligence(customScenario);
  };

  const toggleCheckItem = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ideal':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Great':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'Caution':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Avoid':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-400 via-sky-400 to-indigo-500 text-slate-950 shadow-lg shadow-sky-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Weather Intelligence & Planning
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white uppercase tracking-wider">
                AI Powered
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized activity recommendations, clothing advice & smart planning feedback
            </p>
          </div>
        </div>

        <button
          onClick={() => onRefreshIntelligence()}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Regenerate Insights</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center space-y-3 bg-slate-800/40 rounded-2xl border border-slate-800">
          <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-200">Analyzing weather metrics with Gemini AI...</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Computing outdoor activity scores, outfit recommendations, and custom scenario feedback.
          </p>
        </div>
      ) : intelligence ? (
        <div className="space-y-6">

          {/* AI Executive Summary Banner */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-sky-500/20 text-slate-200 text-sm leading-relaxed shadow-md flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sky-300 block mb-1">AI Executive Briefing</span>
              {intelligence.summary}
            </div>
          </div>

          {/* Outfit & Clothing Advisor */}
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Shirt className="w-4 h-4 text-sky-400" />
              Clothing & Gear Recommendation
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed pl-6 border-l-2 border-sky-500/40">
              {intelligence.outfitAdvice}
            </p>
          </div>

          {/* Activity Recommendations Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Outdoor Activity Index
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {intelligence.activityRecommendations.map((act) => (
                <div
                  key={act.activity}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-200">{act.activity}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(act.status)}`}>
                      {act.status} ({act.score}/100)
                    </span>
                  </div>

                  {/* Progress Gauge */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        act.score >= 80
                          ? 'bg-emerald-400'
                          : act.score >= 60
                          ? 'bg-sky-400'
                          : act.score >= 40
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${act.score}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-400">{act.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Scenario / Plan Feedback */}
          <div className="p-5 rounded-2xl bg-slate-800/70 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" />
                Custom Scenario Weather Advisor
              </h3>
              <span className="text-[11px] text-slate-400">Test your specific plan</span>
            </div>

            {intelligence.customPlanFeedback && (
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-xs text-slate-200 leading-relaxed">
                <span className="font-bold text-indigo-300 block mb-1">Scenario Assessment:</span>
                {intelligence.customPlanFeedback}
              </div>
            )}

            <form onSubmit={handleCustomPlanSubmit} className="flex gap-2">
              <input
                type="text"
                value={customScenario}
                onChange={(e) => setCustomScenario(e.target.value)}
                placeholder="Ask e.g.: 'Planning a 5km run at 6 PM' or 'Outdoor picnic on Saturday?'"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!customScenario.trim() || isLoading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                Evaluate Plan
              </button>
            </form>
          </div>

          {/* Hourly Timeline Tips & Travel Essentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Hourly Tips */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" /> Hourly Windows & Tips
              </h4>
              <div className="space-y-2 text-xs">
                {intelligence.hourlyTips.map((tip) => (
                  <div key={tip.timeFrame} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <span className="font-semibold text-sky-300 block text-[11px] mb-0.5">{tip.timeFrame}</span>
                    <span className="text-slate-300">{tip.tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Essentials */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Luggage className="w-4 h-4 text-amber-400" /> Travel & Day Packing Checklist
              </h4>
              <div className="space-y-1.5 text-xs">
                {intelligence.travelPackingEssentials.map((item) => {
                  const isChecked = !!checkedItems[item];
                  return (
                    <button
                      key={item}
                      onClick={() => toggleCheckItem(item)}
                      className={`w-full text-left p-2 rounded-xl border flex items-center justify-between transition ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 line-through'
                          : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <span>{item}</span>
                      <CheckCircle2 className={`w-4 h-4 ${isChecked ? 'text-emerald-400' : 'text-slate-600'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="p-6 text-center text-sm text-slate-400">
          No weather intelligence available. Click &quot;Regenerate Insights&quot; to fetch AI analysis.
        </div>
      )}
    </div>
  );
};
