import React, { useState, useMemo } from 'react';
import {
  Star,
  MapPin,
  Filter,
  Check,
  Building2,
  Waves,
  Eye,
  ArrowRight,
  Sparkles,
  Search,
  X
} from 'lucide-react';
import { HotelOption, HotelRoom, SearchQuery } from '../types/travel';
import { MOCK_HOTELS } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import { HotelDetailsModal } from './HotelDetailsModal';

interface HotelSectionProps {
  query: SearchQuery;
  onBookHotel: (hotel: HotelOption, room?: HotelRoom) => void;
}

export const HotelSection: React.FC<HotelSectionProps> = ({ query, onBookHotel }) => {
  const [selectedHotelForModal, setSelectedHotelForModal] = useState<HotelOption | null>(null);

  // Filters state
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [hotelTypeFilter, setHotelTypeFilter] = useState<string>('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [searchLocation, setSearchLocation] = useState<string>('');

  const dep = new Date(query.departureDate || '2026-10-15');
  const ret = new Date(query.returnDate || '2026-10-20');
  const diffTime = Math.abs(ret.getTime() - dep.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) || 5;

  const amenityOptions = [
    'Breakfast included',
    'Free cancellation',
    'AC',
    'Wi-Fi',
    'Swimming pool',
    'Parking',
    'Sea view',
  ];

  const handleToggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setPriceFilter('all');
    setRatingFilter(0);
    setHotelTypeFilter('all');
    setSelectedAmenities([]);
    setSearchLocation('');
  };

  // Filtered hotels
  const filteredHotels = useMemo(() => {
    return MOCK_HOTELS.filter((hotel) => {
      // Price
      if (priceFilter === 'under2500' && hotel.pricePerNight >= 2500) return false;
      if (priceFilter === '2500to5000' && (hotel.pricePerNight < 2500 || hotel.pricePerNight > 5000))
        return false;
      if (priceFilter === 'above5000' && hotel.pricePerNight <= 5000) return false;

      // Rating
      if (ratingFilter > 0 && hotel.rating < ratingFilter) return false;

      // Hotel Type
      if (hotelTypeFilter !== 'all' && hotel.hotelType !== hotelTypeFilter) return false;

      // Amenities
      if (
        selectedAmenities.length > 0 &&
        !selectedAmenities.every((amenity) => hotel.amenities.includes(amenity))
      ) {
        return false;
      }

      // Location search
      if (
        searchLocation.trim() &&
        !hotel.location.toLowerCase().includes(searchLocation.toLowerCase()) &&
        !hotel.name.toLowerCase().includes(searchLocation.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [priceFilter, ratingFilter, hotelTypeFilter, selectedAmenities, searchLocation]);

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
              <span>Step 2 · Accommodations & Resorts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Curated Stays in {query.to.split(',')[0]}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Verified beachfront resorts, boutique villas, and heritage stays for {nights} nights ({query.travelers} guests).
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredHotels.length}</span> verified properties
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 mb-8 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Filter className="w-4 h-4 text-teal-600" />
              <span>Filters & Preferences</span>
            </div>

            {(priceFilter !== 'all' ||
              ratingFilter > 0 ||
              hotelTypeFilter !== 'all' ||
              selectedAmenities.length > 0 ||
              searchLocation) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Price Per Night
              </label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                <option value="all">All Prices</option>
                <option value="under2500">Under ₹2,500 (Budget)</option>
                <option value="2500to5000">₹2,500 – ₹5,000 (Mid-tier)</option>
                <option value="above5000">Above ₹5,000 (Luxury)</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Minimum Rating
              </label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>4.5★ and above</option>
                <option value={4.8}>4.8★ Top Tier Only</option>
              </select>
            </div>

            {/* Hotel Type */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Property Style
              </label>
              <select
                value={hotelTypeFilter}
                onChange={(e) => setHotelTypeFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                <option value="all">All Property Types</option>
                <option value="Luxury Resort">Luxury Resort</option>
                <option value="Boutique Villa">Boutique Villa</option>
                <option value="Heritage">Portuguese Heritage</option>
                <option value="Budget Friendly">Budget Friendly / Haven</option>
              </select>
            </div>

            {/* Location / Area Search */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Neighborhood / Beach
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="e.g. Candolim, Ashvem"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Amenities Pills Filter */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block mb-2">Popular Amenities:</span>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleToggleAmenity(amenity)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-teal-600 border-teal-600 text-white font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHotels.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-slate-600 text-sm">
                No properties match your exact filters. Try relaxing price or amenity filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredHotels.map((hotel) => {
              const totalPrice = hotel.pricePerNight * nights;

              return (
                <div
                  key={hotel.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Hotel Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                      {hotel.hotelType}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-1 font-semibold">
                        <Waves className="w-3.5 h-3.5 text-teal-300" />
                        <span className="truncate">{hotel.distanceToBeach}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name and Rating */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-teal-700 transition-colors">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md text-amber-700 text-xs font-bold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{hotel.rating}</span>
                        </div>
                      </div>

                      {/* Location & Reviews */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{hotel.location}</span>
                        <span>·</span>
                        <span>{hotel.reviewsCount} reviews</span>
                      </div>

                      {/* Description snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {hotel.description}
                      </p>

                      {/* Amenities Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                          >
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 4 && (
                          <span className="text-[11px] font-medium text-slate-400 self-center">
                            +{hotel.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and CTA Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] text-slate-400">
                          {nights} nights · {query.travelers} Guests
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-extrabold text-teal-800 font-mono tabular-nums">
                            {formatCurrency(hotel.pricePerNight)}
                          </span>
                          <span className="text-xs text-slate-500">/ night</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Total {formatCurrency(totalPrice)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedHotelForModal(hotel)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onBookHotel(hotel, hotel.rooms[0])}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors whitespace-nowrap"
                        >
                          <span>Book Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Hotel Detailed Modal */}
      {selectedHotelForModal && (
        <HotelDetailsModal
          hotel={selectedHotelForModal}
          query={query}
          onClose={() => setSelectedHotelForModal(null)}
          onBookHotel={(hotel, room) => {
            setSelectedHotelForModal(null);
            onBookHotel(hotel, room);
          }}
        />
      )}
    </section>
  );
};
