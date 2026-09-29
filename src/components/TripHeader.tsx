import React from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Plane,
  Bed,
  Compass,
  UtensilsCrossed,
  Car,
  Calculator,
  ShieldAlert,
  ArrowRight,
  Edit3
} from 'lucide-react';
import { SearchQuery } from '../types/travel';
import { formatDateRange } from '../utils/formatters';

interface TripHeaderProps {
  query: SearchQuery;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onEditSearch: () => void;
}

export const TripHeader: React.FC<TripHeaderProps> = ({
  query,
  activeTab,
  onSelectTab,
  onEditSearch
}) => {
  const tabs = [
    { id: 'transport', label: '1. Transport', icon: Plane, count: '4 Modes' },
    { id: 'hotels', label: '2. Hotels', icon: Bed, count: '4 Verified' },
    { id: 'itinerary', label: '3. Itinerary', icon: Calendar, count: '5 Days' },
    { id: 'attractions', label: '4. Attractions', icon: Compass, count: '8 Sights' },
    { id: 'local-commute', label: '5. Local Transit', icon: Car, count: 'Rentals' },
    { id: 'dining', label: '6. Restaurants', icon: UtensilsCrossed, count: 'Must Try' },
    { id: 'budget-checklist', label: '7. Budget & Checklist', icon: Calculator, count: 'Planner' },
    { id: 'emergency', label: '8. Safety & Map', icon: ShieldAlert, count: '24/7' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs no-print">
      {/* Trip Information Summary Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Destination Path */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-base sm:text-xl font-bold text-slate-900 tracking-tight">
              <span className="text-slate-800">{query.from.split(',')[0]}</span>
              <ArrowRight className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="text-teal-700">{query.to.split(',')[0]}</span>
            </div>

            <button
              onClick={onEditSearch}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              title="Edit Route or Dates"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Modify</span>
            </button>
          </div>

          {/* Quick Trip Metadata */}
          <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600 flex-wrap">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>{formatDateRange(query.departureDate, query.returnDate)}</span>
            </div>

            <span className="text-slate-300">·</span>

            <div className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-teal-600" />
              <span>
                {query.travelers} Traveler{query.travelers > 1 ? 's' : ''} ({query.tripType === 'roundTrip' ? 'Round Trip' : 'One Way'})
              </span>
            </div>

            <span className="text-slate-300">·</span>

            <div className="flex items-center gap-1.5 text-teal-700 font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Trip Ready</span>
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable Tabs */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-teal-700 text-teal-100' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
