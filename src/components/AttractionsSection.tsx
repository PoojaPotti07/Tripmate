import React, { useState } from 'react';
import {
  Compass,
  Clock,
  Ticket,
  Sun,
  Plus,
  Check,
  Star,
  MapPin,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Attraction, DayItinerary, ActivityItem } from '../types/travel';
import { MOCK_ATTRACTIONS } from '../data/mockData';

interface AttractionsSectionProps {
  destination: string;
  itinerary: DayItinerary[];
  onAddAttractionToItinerary: (dayNumber: number, activity: ActivityItem) => void;
}

type AttractionCategory = 'All' | 'Popular' | 'Hidden Gem' | 'Beach' | 'Historical' | 'Adventure';

export const AttractionsSection: React.FC<AttractionsSectionProps> = ({
  destination,
  itinerary,
  onAddAttractionToItinerary,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AttractionCategory>('All');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const categories: AttractionCategory[] = [
    'All',
    'Popular',
    'Hidden Gem',
    'Beach',
    'Historical',
    'Adventure',
  ];

  const filteredAttractions =
    selectedCategory === 'All'
      ? MOCK_ATTRACTIONS
      : MOCK_ATTRACTIONS.filter((a) => a.category === selectedCategory);

  const handleSelectDay = (attraction: Attraction, dayNumber: number) => {
    const newActivity: ActivityItem = {
      id: `att-act-${Date.now()}`,
      time: '02:00 PM',
      title: attraction.name,
      location: `${attraction.name}, ${attraction.destination}`,
      tag:
        attraction.category === 'Beach'
          ? 'Leisure'
          : attraction.category === 'Adventure'
          ? 'Adventure'
          : 'Sightseeing',
      description: attraction.description,
      cost: attraction.entryFee.includes('₹')
        ? parseInt(attraction.entryFee.replace(/[^0-9]/g, ''), 10) || 50
        : 0,
      duration: attraction.recommendedDuration,
    };

    onAddAttractionToItinerary(dayNumber, newActivity);
    setAddingId(null);
    setAddedToast(`Added "${attraction.name}" to Day ${dayNumber}!`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
              <span>Step 4 · Destination Discovery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Tourist Attractions in {destination.split(',')[0]}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              From celebrated heritage fortresses to secret coves and adrenaline-packed ocean adventures.
            </p>
          </div>

          {/* Toast Notification */}
          {addedToast && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-teal-600" />
              <span>{addedToast}</span>
            </div>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? 'All Attractions' : cat}
              </button>
            );
          })}
        </div>

        {/* Attraction Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map((attraction) => (
            <div
              key={attraction.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Image & Category Tag */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                  {attraction.category}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-teal-300" />
                    {attraction.recommendedDuration}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-teal-700 transition-colors">
                    {attraction.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {attraction.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {attraction.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Information Grid */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Ticket className="w-3 h-3 text-teal-600" /> Entry Fee:
                      </span>
                      <span className="font-semibold text-slate-800">{attraction.entryFee}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-teal-600" /> Hours:
                      </span>
                      <span className="font-medium text-slate-700">{attraction.openingHours}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sun className="w-3 h-3 text-amber-500" /> Best Time:
                      </span>
                      <span className="font-medium text-slate-700">{attraction.bestTime}</span>
                    </div>
                  </div>
                </div>

                {/* Add to Itinerary Dropdown / Button */}
                <div className="mt-5 pt-3 border-t border-slate-100 relative">
                  {addingId === attraction.id ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1.5 shadow-sm">
                      <div className="text-[11px] font-bold text-slate-700">
                        Select which day to add this activity:
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {itinerary.map((day) => (
                          <button
                            key={day.dayNumber}
                            type="button"
                            onClick={() => handleSelectDay(attraction, day.dayNumber)}
                            className="px-2 py-1 text-xs font-bold text-teal-800 bg-white hover:bg-teal-600 hover:text-white border border-slate-200 rounded-lg transition-colors text-center"
                          >
                            D{day.dayNumber}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setAddingId(null)}
                        className="text-[10px] text-slate-500 hover:underline block text-center w-full mt-1"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddingId(attraction.id)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Itinerary</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
