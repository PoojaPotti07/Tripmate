import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Check,
  Calendar,
  Clock,
  ShieldCheck,
  Wifi,
  Coffee,
  Waves,
  Car,
  Wind,
  Bed,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { HotelOption, HotelRoom, SearchQuery } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface HotelDetailsModalProps {
  hotel: HotelOption;
  query: SearchQuery;
  onClose: () => void;
  onBookHotel: (hotel: HotelOption, room: HotelRoom) => void;
}

export const HotelDetailsModal: React.FC<HotelDetailsModalProps> = ({
  hotel,
  query,
  onClose,
  onBookHotel,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom>(hotel.rooms[0]);

  // Calculate nights
  const dep = new Date(query.departureDate || '2026-10-15');
  const ret = new Date(query.returnDate || '2026-10-20');
  const diffTime = Math.abs(ret.getTime() - dep.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) || 5;

  const totalPrice = selectedRoom.pricePerNight * nights;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 max-h-[92vh] flex flex-col">
        {/* Top sticky header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {hotel.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>{hotel.location}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {hotel.rating} ({hotel.reviewsCount} reviews)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner">
              <img
                src={hotel.gallery[selectedImageIndex] || hotel.image}
                alt={hotel.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                Photo {selectedImageIndex + 1} of {hotel.gallery.length}
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {hotel.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-teal-600 ring-2 ring-teal-200'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Key Facts & Timing */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Check-in</div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>{hotel.checkIn}</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Check-out</div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>{hotel.checkOut}</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Beach Access</div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Waves className="w-3.5 h-3.5 text-teal-600" />
                <span>{hotel.distanceToBeach}</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Transit Distance</div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>{hotel.distanceToTransit}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">About the Property</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{hotel.description}</p>
          </div>

          {/* Amenities Grid */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Popular Property Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hotel.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <div className="w-6 h-6 rounded-md bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Selection */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Select Room Category</h3>
            <div className="space-y-3">
              {hotel.rooms.map((room) => {
                const isSelected = selectedRoom.id === room.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/40 ring-1 ring-teal-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="hotel-room"
                            checked={isSelected}
                            onChange={() => setSelectedRoom(room)}
                            className="text-teal-600 focus:ring-teal-500"
                          />
                          <h4 className="text-sm font-bold text-slate-900">{room.name}</h4>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 pl-6">
                          <span className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5 text-slate-400" />
                            {room.bedType}
                          </span>
                          <span>·</span>
                          <span>{room.size}</span>
                          <span>·</span>
                          <span>Up to {room.maxGuests} Guests</span>
                        </div>
                      </div>

                      <div className="text-right pl-6 sm:pl-0">
                        <div className="text-lg font-bold text-teal-800 font-mono tabular-nums">
                          {formatCurrency(room.pricePerNight)}
                          <span className="text-xs text-slate-500 font-normal"> / night</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 pl-6 flex flex-wrap gap-2">
                      {room.features.map((feature, fIdx) => (
                        <span
                          key={fIdx}
                          className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cancellation Policy and Protection */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-emerald-900">Cancellation Guarantee</div>
              <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                {hotel.cancellationPolicy}. 100% refund processed immediately with zero booking fees on TripMate.
              </p>
            </div>
          </div>

          {/* Guest Reviews */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Real Verified Guest Reviews</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hotel.reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{rev.author}</span>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(rev.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] text-slate-500 ml-1">({rev.tripType})</span>
                  </div>
                  <p className="text-slate-600 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Booking Sticky Bar */}
        <div className="sticky bottom-0 z-20 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">
              {nights} nights · {query.travelers} Traveler{query.travelers > 1 ? 's' : ''}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-teal-800 font-mono tabular-nums">
                {formatCurrency(totalPrice)}
              </span>
              <span className="text-xs text-slate-500 font-medium">total inclusive of taxes</span>
            </div>
          </div>

          <button
            onClick={() => onBookHotel(hotel, selectedRoom)}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors"
          >
            <span>Book This Stay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
