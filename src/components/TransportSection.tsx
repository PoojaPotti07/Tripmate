import React, { useState, useMemo } from 'react';
import {
  Plane,
  Train,
  Bus,
  Car,
  Clock,
  ArrowRight,
  Star,
  ShieldCheck,
  Luggage,
  Sparkles,
  ArrowUpDown,
  CheckCircle2
} from 'lucide-react';
import { TransportOption, TransportType, SearchQuery } from '../types/travel';
import { MOCK_TRANSPORTS } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

interface TransportSectionProps {
  query: SearchQuery;
  onBookTransport: (transport: TransportOption, selectedClass: string) => void;
}

type SortOption = 'recommended' | 'cheapest' | 'fastest' | 'departure';

export const TransportSection: React.FC<TransportSectionProps> = ({ query, onBookTransport }) => {
  const [activeType, setActiveType] = useState<TransportType>('flight');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [selectedClassMap, setSelectedClassMap] = useState<Record<string, string>>({});

  const transportTabs = [
    { type: 'flight' as TransportType, label: 'Flights', icon: Plane, sub: 'Fastest 5h 20m' },
    { type: 'train' as TransportType, label: 'Trains', icon: Train, sub: 'Scenic Sleeper' },
    { type: 'bus' as TransportType, label: 'Buses', icon: Bus, sub: 'AC Sleeper 21h' },
    { type: 'cab' as TransportType, label: 'Outstation Cabs', icon: Car, sub: 'Door-to-Door' },
  ];

  // Filter and sort transports
  const filteredTransports = useMemo(() => {
    const list = MOCK_TRANSPORTS.filter((t) => t.type === activeType);

    return [...list].sort((a, b) => {
      if (sortBy === 'cheapest') {
        return a.price - b.price;
      }
      if (sortBy === 'fastest') {
        return a.durationMinutes - b.durationMinutes;
      }
      if (sortBy === 'departure') {
        return a.departureTime.localeCompare(b.departureTime);
      }
      // recommended: balance rating and price
      return b.rating - a.rating;
    });
  }, [activeType, sortBy]);

  const handleClassChange = (transportId: string, className: string) => {
    setSelectedClassMap((prev) => ({
      ...prev,
      [transportId]: className,
    }));
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
              <span>Step 1 · Transportation Options</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Transit from {query.from.split(',')[0]} to {query.to.split(',')[0]}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Compare all scheduled transit modes, seat availability, and live fare guarantees.
            </p>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium">
              {(
                [
                  { id: 'recommended', label: 'Recommended' },
                  { id: 'cheapest', label: 'Cheapest' },
                  { id: 'fastest', label: 'Fastest' },
                  { id: 'departure', label: 'Departure' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id)}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    sortBy === s.id
                      ? 'bg-white text-teal-800 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transportation Mode Tabs (Flights / Trains / Buses / Cabs) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {transportTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeType === tab.type;
            const count = MOCK_TRANSPORTS.filter((t) => t.type === tab.type).length;

            return (
              <button
                key={tab.type}
                onClick={() => setActiveType(tab.type)}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                  isActive
                    ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 font-mono">
                    {count} option{count > 1 ? 's' : ''}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold tracking-tight ${
                    isActive ? 'text-teal-900' : 'text-slate-900'
                  }`}
                >
                  {tab.label}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">{tab.sub}</span>
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {filteredTransports.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-slate-600 text-sm">
                No scheduled options available for this specific filter.
              </p>
            </div>
          ) : (
            filteredTransports.map((item) => {
              const currentClass =
                selectedClassMap[item.id] || (item.classes[0]?.name ?? 'Standard');
              const selectedClassObj =
                item.classes.find((c) => c.name === currentClass) || item.classes[0];
              const itemPrice = selectedClassObj ? selectedClassObj.price : item.price;
              const totalPrice = itemPrice * query.travelers;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-4 sm:p-6"
                >
                  {/* Top Bar inside Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-teal-700 font-bold shrink-0">
                        {item.type === 'flight' && <Plane className="w-5 h-5" />}
                        {item.type === 'train' && <Train className="w-5 h-5" />}
                        {item.type === 'bus' && <Bus className="w-5 h-5" />}
                        {item.type === 'cab' && <Car className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 tracking-tight">
                            {item.operator}
                          </h3>
                          <span className="text-xs text-slate-500 font-mono">{item.code}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {item.rating}
                          </span>
                          <span>·</span>
                          <span>{item.reviewsCount} reviews</span>
                          {item.badge && (
                            <>
                              <span>·</span>
                              <span className="text-teal-700 font-semibold">{item.badge}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 font-medium sm:text-right">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                        {item.classAvailability}
                      </span>
                    </div>
                  </div>

                  {/* Timetable Schedule Grid */}
                  <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Departure */}
                    <div className="md:col-span-3">
                      <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                        {item.departureTime}
                      </div>
                      <div className="text-xs font-semibold text-slate-700 mt-0.5">
                        {item.departureStation}
                      </div>
                      <div className="text-[11px] text-slate-500">{item.departureCity}</div>
                    </div>

                    {/* Duration & Stops graphic */}
                    <div className="md:col-span-4 text-center px-2">
                      <div className="text-xs font-semibold text-slate-600 flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.duration}</span>
                      </div>

                      <div className="relative flex items-center justify-center my-1.5">
                        <div className="w-full h-0.5 bg-slate-200" />
                        <div className="absolute w-2 h-2 rounded-full bg-teal-600 left-0" />
                        <div className="absolute px-2 bg-white text-[10px] font-medium text-slate-500 border border-slate-200 rounded-full">
                          {item.stops}
                        </div>
                        <div className="absolute w-2 h-2 rounded-full bg-teal-600 right-0" />
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1">
                        {item.stopsCount === 0 ? 'Direct Route' : `${item.stopsCount} intermediate connection`}
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="md:col-span-3 md:text-right">
                      <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                        {item.arrivalTime}
                      </div>
                      <div className="text-xs font-semibold text-slate-700 mt-0.5">
                        {item.arrivalStation}
                      </div>
                      <div className="text-[11px] text-slate-500">{item.arrivalCity}</div>
                    </div>

                    {/* Price & Book CTA */}
                    <div className="md:col-span-2 md:text-right pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex md:flex-col justify-between items-end">
                      <div>
                        <div className="text-xs text-slate-400 line-through font-mono">
                          {formatCurrency(item.originalPrice)}
                        </div>
                        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums text-teal-700">
                          {formatCurrency(itemPrice)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          per person · Total {formatCurrency(totalPrice)}
                        </div>
                      </div>

                      <button
                        onClick={() => onBookTransport(item, currentClass)}
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors whitespace-nowrap"
                      >
                        <span>Book Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Seat / Class Options Selector */}
                  {item.classes && item.classes.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 mr-1">Select Class:</span>
                      {item.classes.map((cls) => {
                        const isSelected = cls.name === currentClass;
                        return (
                          <button
                            key={cls.name}
                            type="button"
                            onClick={() => handleClassChange(item.id, cls.name)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
                              isSelected
                                ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{cls.name}</span>
                            <span className="font-mono font-semibold text-slate-900">
                              {formatCurrency(cls.price)}
                            </span>
                            <span className="text-[10px] text-slate-500">({cls.seatsLeft} left)</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Amenities and Cancellation policy */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      {item.amenities.map((amenity, idx) => (
                        <span key={idx} className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-teal-600" />
                          <span>{amenity}</span>
                        </span>
                      ))}
                    </div>

                    <div className="text-slate-400 italic">
                      {item.cancellationPolicy}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
