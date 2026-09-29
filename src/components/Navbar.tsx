import React, { useState } from 'react';
import { Compass, Ticket, Menu, X, Plane, Bed, Calendar, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  bookingCount: number;
  onOpenBookings: () => void;
  onOpenNewTripModal?: () => void;
  isDashboardActive: boolean;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  bookingCount,
  onOpenBookings,
  isDashboardActive,
  onGoHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'transport', label: 'Transports', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Bed },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'attractions', label: 'Attractions', icon: Compass },
    { id: 'emergency', label: 'Safety & Maps', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 no-print transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 group text-left focus:outline-none"
            title="TripMate - Home"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-700 transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
              TripMate
            </span>
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          {isDashboardActive ? (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => onSelectTab(link.id)}
                    className={`py-1 relative transition-colors ${
                      isActive
                        ? 'text-teal-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#popular-destinations" className="hover:text-slate-900 transition-colors">
                Destinations
              </a>
              <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
                How It Works
              </a>
              <a href="#why-tripmate" className="hover:text-slate-900 transition-colors">
                Features
              </a>
            </nav>
          )}

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBookings}
              className="relative inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <Ticket className="w-4 h-4 text-teal-600" />
              <span>My Bookings</span>
              {bookingCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-teal-600 rounded-full">
                  {bookingCount}
                </span>
              )}
            </button>

            {!isDashboardActive && (
              <a
                href="#trip-search"
                className="hidden sm:inline-flex items-center px-4 py-2 text-xs sm:text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                Plan Your Trip
              </a>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg">
          {isDashboardActive ? (
            <>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 pb-1">
                Trip Sections
              </div>
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      onSelectTab(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-left ${
                      isActive
                        ? 'bg-teal-50 text-teal-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-teal-600" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </>
          ) : (
            <div className="space-y-1">
              <a
                href="#popular-destinations"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Popular Destinations
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                How It Works
              </a>
              <a
                href="#trip-search"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg"
              >
                Plan a Trip Now
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
