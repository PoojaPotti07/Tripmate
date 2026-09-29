import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  ArrowRightLeft,
  Search,
  Sparkles,
  Plane,
  Train,
  Bus,
  Car
} from 'lucide-react';
import { SearchQuery, TripType } from '../types/travel';
import { POPULAR_DESTINATIONS, HERO_IMAGE } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

interface HeroSearchProps {
  onSearch: (query: SearchQuery) => void;
  initialQuery?: SearchQuery;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch, initialQuery }) => {
  const [from, setFrom] = useState(initialQuery?.from || 'Srikakulam, Andhra Pradesh');
  const [to, setTo] = useState(initialQuery?.to || 'Goa, India');
  const [departureDate, setDepartureDate] = useState(initialQuery?.departureDate || '2026-10-15');
  const [returnDate, setReturnDate] = useState(initialQuery?.returnDate || '2026-10-20');
  const [travelers, setTravelers] = useState<number>(initialQuery?.travelers || 2);
  const [tripType, setTripType] = useState<TripType>(initialQuery?.tripType || 'roundTrip');
  const [fromSuggestionsOpen, setFromSuggestionsOpen] = useState(false);
  const [toSuggestionsOpen, setToSuggestionsOpen] = useState(false);

  const cityOptions = [
    'Srikakulam, Andhra Pradesh',
    'Visakhapatnam, Andhra Pradesh',
    'Hyderabad, Telangana',
    'Goa, India',
    'Bengaluru, Karnataka',
    'Chennai, Tamil Nadu',
    'Mumbai, Maharashtra',
    'Delhi, Delhi NCR',
    'Kochi, Kerala',
    'Jaipur, Rajasthan'
  ];

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      from,
      to,
      departureDate,
      returnDate: tripType === 'roundTrip' ? returnDate : '',
      travelers,
      tripType
    });
  };

  const handleSelectPopular = (destinationName: string) => {
    setTo(`${destinationName}, India`);
    onSearch({
      from,
      to: `${destinationName}, India`,
      departureDate,
      returnDate: tripType === 'roundTrip' ? returnDate : '',
      travelers,
      tripType
    });
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 pb-16 pt-8 sm:pt-14 lg:pb-24">
      {/* Background Hero Image with Measured Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Coastal paradise horizon"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center brightness-90 filter"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline & Value Proposition */}
        <div className="text-center max-w-3xl mx-auto mb-10 pt-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-300 uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>All-In-One Unified Travel Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] text-balance">
            Plan Your Trip. Book Everything. Travel Better.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-2xl mx-auto text-balance">
            From tickets to hotels and unforgettable experiences — plan your complete journey in one place.
          </p>
        </div>

        {/* Large Trip Search Card */}
        <div id="trip-search" className="max-w-5xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-slate-200"
          >
            {/* Trip Type Segmented Control */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-wrap gap-3">
              <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setTripType('roundTrip')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    tripType === 'roundTrip'
                      ? 'bg-white text-teal-800 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Round Trip
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('oneWay')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    tripType === 'oneWay'
                      ? 'bg-white text-teal-800 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  One Way
                </button>
              </div>

              {/* Transit coverage highlights */}
              <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-teal-600" /> Flights
                </span>
                <span className="flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-teal-600" /> Trains
                </span>
                <span className="flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5 text-teal-600" /> Buses
                </span>
                <span className="flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-teal-600" /> Outstation Cabs
                </span>
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* FROM field */}
              <div className="md:col-span-3 relative">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  From (Origin)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    onFocus={() => setFromSuggestionsOpen(true)}
                    placeholder="e.g. Srikakulam"
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all truncate"
                    required
                  />
                </div>
                {fromSuggestionsOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
                    {cityOptions.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setFrom(city);
                          setFromSuggestionsOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                      >
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* SWAP button */}
              <div className="md:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-2 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors"
                  title="Swap Origin and Destination"
                >
                  <ArrowRightLeft className="w-4 h-4 rotate-90 md:rotate-0" />
                </button>
              </div>

              {/* TO field */}
              <div className="md:col-span-3 relative">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  To (Destination)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    onFocus={() => setToSuggestionsOpen(true)}
                    placeholder="e.g. Goa, India"
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all truncate"
                    required
                  />
                </div>
                {toSuggestionsOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
                    {cityOptions.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setTo(city);
                          setToSuggestionsOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                      >
                        <MapPin className="w-3 h-3 text-teal-600" />
                        <span>{city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* DATES field */}
              <div className="md:col-span-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Departure
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full px-2.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {tripType === 'roundTrip' ? 'Return' : 'Optional'}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      disabled={tripType === 'oneWay'}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-2.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* TRAVELERS & SEARCH */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Travelers
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={travelers}
                      onChange={(e) => setTravelers(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    >
                      <option value={1}>1 Solo Adult</option>
                      <option value={2}>2 Adults</option>
                      <option value={3}>3 Adults</option>
                      <option value={4}>4 (Family / Group)</option>
                      <option value={6}>6 Group</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>Example:</span>
                <button
                  type="button"
                  onClick={() => {
                    setFrom('Srikakulam, Andhra Pradesh');
                    setTo('Goa, India');
                    setDepartureDate('2026-10-15');
                    setReturnDate('2026-10-20');
                    setTravelers(2);
                    setTripType('roundTrip');
                  }}
                  className="font-medium text-teal-700 hover:underline"
                >
                  Srikakulam → Goa (15 Oct – 20 Oct · 2 Adults)
                </button>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                <span>Search & Plan Complete Journey</span>
              </button>
            </div>
          </form>
        </div>

        {/* Popular Destinations Below Search */}
        <div id="popular-destinations" className="mt-14 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">
                Explore Top Getaways
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Popular Destinations
              </h2>
            </div>
            <p className="hidden sm:block text-xs text-slate-300">
              Click any destination to build an instant full-trip itinerary
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                type="button"
                onClick={() => handleSelectPopular(dest.name)}
                className="group relative overflow-hidden rounded-xl bg-slate-800 text-left border border-slate-700/60 hover:border-teal-500/60 transition-all hover:scale-[1.02] shadow-md flex flex-col justify-end aspect-[4/3]"
              >
                {/* Image */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Content */}
                <div className="relative p-3.5 z-10">
                  <div className="flex items-center justify-between text-[11px] text-teal-300 font-medium mb-0.5">
                    <span>{dest.state}</span>
                    <span>{dest.weather}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-teal-300 transition-colors">
                    {dest.name}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                    {dest.tagline}
                  </p>

                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-200">
                    <span className="text-[11px] text-slate-400">Complete trip from</span>
                    <span className="font-semibold text-white font-mono tabular-nums">
                      {formatCurrency(dest.startingPrice)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
