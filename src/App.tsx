/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { TripHeader } from './components/TripHeader';
import { TransportSection } from './components/TransportSection';
import { HotelSection } from './components/HotelSection';
import { ItinerarySection } from './components/ItinerarySection';
import { AttractionsSection } from './components/AttractionsSection';
import { LocalTransportGuide } from './components/LocalTransportGuide';
import { DiningGuide } from './components/DiningGuide';
import { BudgetAndChecklist } from './components/BudgetAndChecklist';
import { MapAndEmergency } from './components/MapAndEmergency';
import { BookingTicketModal } from './components/BookingTicketModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import {
  SearchQuery,
  TransportOption,
  HotelOption,
  HotelRoom,
  DayItinerary,
  ActivityItem,
  BookingConfirmation
} from './types/travel';
import { DEFAULT_ITINERARY } from './data/mockData';
import { Compass, CheckCircle2, Shield, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  // Search query state (pre-filled with the user's example)
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    from: 'Srikakulam, Andhra Pradesh',
    to: 'Goa, India',
    departureDate: '2026-10-15',
    returnDate: '2026-10-20',
    travelers: 2,
    tripType: 'roundTrip',
  });

  // UI Flow State: True shows dedicated Trip Dashboard; False shows full Homepage Hero
  const [isDashboardActive, setIsDashboardActive] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('transport');

  // Interactive Itinerary State
  const [itinerary, setItinerary] = useState<DayItinerary[]>(DEFAULT_ITINERARY);

  // Bookings State
  const [bookings, setBookings] = useState<BookingConfirmation[]>([]);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState<boolean>(false);

  // Active Booking Modal (for Checkout flow)
  const [bookingModalItem, setBookingModalItem] = useState<{
    type: 'transport' | 'hotel';
    transport?: TransportOption;
    selectedClass?: string;
    hotel?: HotelOption;
    selectedRoom?: HotelRoom;
  } | null>(null);

  // Handler: When user submits search from Hero
  const handleSearchSubmit = (query: SearchQuery) => {
    setSearchQuery(query);
    setIsDashboardActive(true);
    setActiveTab('transport');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Adding attraction to specific itinerary day
  const handleAddAttractionToItinerary = (dayNumber: number, activity: ActivityItem) => {
    setItinerary((prev) =>
      prev.map((day) => {
        if (day.dayNumber === dayNumber) {
          return {
            ...day,
            activities: [...day.activities, activity],
          };
        }
        return day;
      })
    );
  };

  // Handler: Confirming a booking
  const handleConfirmBooking = (confirmation: BookingConfirmation) => {
    setBookings((prev) => [confirmation, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Strict 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        bookingCount={bookings.length}
        onOpenBookings={() => setIsBookingsModalOpen(true)}
        isDashboardActive={isDashboardActive}
        onGoHome={() => {
          setIsDashboardActive(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1">
        {/* HOMEPAGE VIEW: Shown when user wants to search or see top destinations */}
        {!isDashboardActive ? (
          <div>
            <HeroSearch onSearch={handleSearchSubmit} initialQuery={searchQuery} />

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 sm:py-20 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
                    Simplified Travel Logistics
                  </span>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                    How TripMate Coordinates Your Trip
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 text-balance">
                    Never juggle 6 different browser tabs for buses, flights, resorts, and local sightseeing again.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-mono font-bold flex items-center justify-center mb-4">
                      01
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">
                      Search From Anywhere to Anywhere
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Enter your hometown (like Srikakulam) and your dream getaway (like Goa). TripMate links multi-modal flights, trains, sleeper buses, and door-to-door cabs.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-mono font-bold flex items-center justify-center mb-4">
                      02
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">
                      Instant Smart Itinerary Generation
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Automatically receive a balanced, timed day-by-day itinerary tailored to your duration. Easily add attractions, move activities, or tweak hours.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-mono font-bold flex items-center justify-center mb-4">
                      03
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">
                      Complete Stays, Guides & Safety
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Book certified resorts, check scooter rentals, explore iconic seafood shacks, track your budget, and access 24/7 tourist police assistance.
                    </p>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <button
                    onClick={() => {
                      setIsDashboardActive(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all"
                  >
                    <span>View Srikakulam → Goa Trip Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* DEDICATED TRIP DASHBOARD VIEW */
          <div>
            {/* Top Dashboard Metadata & Tab Switcher */}
            <TripHeader
              query={searchQuery}
              activeTab={activeTab}
              onSelectTab={(tabId) => setActiveTab(tabId)}
              onEditSearch={() => {
                setIsDashboardActive(false);
                setTimeout(() => {
                  document.getElementById('trip-search')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            />

            {/* Active Tab View */}
            <div>
              {activeTab === 'transport' && (
                <TransportSection
                  query={searchQuery}
                  onBookTransport={(transport, selectedClass) => {
                    setBookingModalItem({
                      type: 'transport',
                      transport,
                      selectedClass,
                    });
                  }}
                />
              )}

              {activeTab === 'hotels' && (
                <HotelSection
                  query={searchQuery}
                  onBookHotel={(hotel, room) => {
                    setBookingModalItem({
                      type: 'hotel',
                      hotel,
                      selectedRoom: room,
                    });
                  }}
                />
              )}

              {activeTab === 'itinerary' && (
                <ItinerarySection
                  itinerary={itinerary}
                  query={searchQuery}
                  onUpdateItinerary={(updated) => setItinerary(updated)}
                />
              )}

              {activeTab === 'attractions' && (
                <AttractionsSection
                  destination={searchQuery.to}
                  itinerary={itinerary}
                  onAddAttractionToItinerary={handleAddAttractionToItinerary}
                />
              )}

              {activeTab === 'local-commute' && (
                <LocalTransportGuide destination={searchQuery.to} />
              )}

              {activeTab === 'dining' && <DiningGuide destination={searchQuery.to} />}

              {activeTab === 'budget-checklist' && <BudgetAndChecklist query={searchQuery} />}

              {activeTab === 'emergency' && <MapAndEmergency query={searchQuery} />}
            </div>
          </div>
        )}
      </main>

      {/* Booking Checkout Modal */}
      {bookingModalItem && (
        <BookingTicketModal
          bookingItem={bookingModalItem}
          query={searchQuery}
          onClose={() => setBookingModalItem(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* My Bookings Voucher History Modal */}
      {isBookingsModalOpen && (
        <MyBookingsModal bookings={bookings} onClose={() => setIsBookingsModalOpen(false)} />
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">TripMate</span>
              <span className="text-xs text-slate-500 font-mono ml-2">All-in-One Travel</span>
            </div>

            <div className="flex items-center gap-6 text-xs font-medium">
              <button
                onClick={() => {
                  setIsDashboardActive(true);
                  setActiveTab('transport');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors"
              >
                Transports
              </button>
              <button
                onClick={() => {
                  setIsDashboardActive(true);
                  setActiveTab('hotels');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors"
              >
                Hotels
              </button>
              <button
                onClick={() => {
                  setIsDashboardActive(true);
                  setActiveTab('itinerary');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors"
              >
                Itinerary Planner
              </button>
              <button
                onClick={() => {
                  setIsDashboardActive(true);
                  setActiveTab('emergency');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors"
              >
                Emergency Helplines
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div>
              © 2026 TripMate Technologies. All rights reserved. Srikakulam → Goa and Pan-India Unified Journeys.
            </div>
            <div className="flex items-center gap-4">
              <span>Zero-Cancellation Guarantee</span>
              <span>·</span>
              <span>24/7 Verified Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
