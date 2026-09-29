import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  PhoneCall,
  ShieldAlert,
  Hospital,
  AlertTriangle,
  ExternalLink,
  Compass,
  ArrowRight
} from 'lucide-react';
import { SearchQuery } from '../types/travel';
import { EMERGENCY_CONTACTS } from '../data/mockData';

interface MapAndEmergencyProps {
  query: SearchQuery;
}

export const MapAndEmergency: React.FC<MapAndEmergencyProps> = ({ query }) => {
  const [activePin, setActivePin] = useState<number>(0);

  const routeWaypoints = [
    {
      id: 0,
      name: 'Origin: Srikakulam, Andhra Pradesh',
      type: 'Origin City',
      description: 'Starting point of your trip. Connect via NH16 or local express to transit hubs.',
      coords: '18.2949° N, 83.8938° E',
      status: 'Departure Point'
    },
    {
      id: 1,
      name: 'Transit Hub: Visakhapatnam (VTZ)',
      type: 'Airport / Rail Junction',
      description: 'Major transit airport (VTZ) and coastal rail head with regular flights to Goa.',
      coords: '17.7215° N, 83.2245° E',
      status: '105 km from Srikakulam'
    },
    {
      id: 2,
      name: 'Destination Arrival: Goa (Mopa / Dabolim)',
      type: 'Arrival Airport',
      description: 'Manohar International Airport (GOX) or Dabolim (GOI) welcoming travelers.',
      coords: '15.7533° N, 73.8647° E',
      status: 'Arrival Point'
    },
    {
      id: 3,
      name: 'Stay Area: Candolim & Sinquerim Coast',
      type: 'Resort Base',
      description: 'Central North Goa base close to beaches, heritage forts, and cafes.',
      coords: '15.5173° N, 73.7663° E',
      status: '32 km from Mopa'
    },
    {
      id: 4,
      name: 'Old Goa Heritage & Latin Quarter',
      type: 'Historic Core',
      description: 'Basilica of Bom Jesus, Se Cathedral, and colorful Fontainhas.',
      coords: '15.5009° N, 73.9116° E',
      status: '16 km from Candolim'
    },
    {
      id: 5,
      name: 'South Goa: Palolem & Butterfly Beach',
      type: 'Beach Paradise',
      description: 'Pristine crescent bay, dolphin watching, and silent sea cliffs.',
      coords: '15.0100° N, 74.0232° E',
      status: '68 km from Candolim'
    }
  ];

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* MAP & ROUTE NAVIGATION */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
              <span>Step 8 · Maps & Waypoints</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Route Navigation & Key Destination Points
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Plotted itinerary path connecting your origin to Goa’s coastal hubs and landmarks.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
            {/* Left Interactive Waypoint List */}
            <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 mb-4">
                  Journey Route Waypoints
                </h3>

                <div className="space-y-2.5">
                  {routeWaypoints.map((wp) => {
                    const isSelected = activePin === wp.id;
                    return (
                      <button
                        key={wp.id}
                        type="button"
                        onClick={() => setActivePin(wp.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 shadow-2xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {wp.id + 1}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{wp.name}</span>
                            <span className="text-[10px] text-teal-700 font-semibold">{wp.type}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {wp.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Waypoint details */}
              <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">{routeWaypoints[activePin].name}</span>
                  <span className="text-teal-700 font-mono font-semibold">
                    {routeWaypoints[activePin].status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {routeWaypoints[activePin].description}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    routeWaypoints[activePin].name
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
                >
                  <span>Open in Google Maps Navigation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Map Canvas Simulation */}
            <div className="lg:col-span-7 bg-slate-900 p-6 flex flex-col justify-between relative overflow-hidden min-h-[380px]">
              {/* Map stylized background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                  <Compass className="w-4 h-4 text-teal-400 animate-spin" style={{ animationDuration: '10s' }} />
                  <span>Interactive Route Overview</span>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  Coordinates: {routeWaypoints[activePin].coords}
                </div>
              </div>

              {/* Graphical Path Visualization */}
              <div className="relative z-10 py-12 flex flex-col items-center justify-center">
                <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Srikakulam (CHE)</span>
                    <span className="text-teal-400 font-bold">1,240 km Route</span>
                    <span>Goa (GOI/GOX)</span>
                  </div>

                  <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${((activePin + 1) / routeWaypoints.length) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Sector</span>
                      <div className="text-sm font-bold text-white">
                        {routeWaypoints[activePin].name.split(':')[1] || routeWaypoints[activePin].name}
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500 flex items-center justify-center text-teal-300">
                      <Navigation className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Bar */}
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                <span>GPS Assisted Navigation Ready</span>
                <span className="text-teal-400 font-mono">Offline Maps Recommended</span>
              </div>
            </div>
          </div>
        </div>

        {/* EMERGENCY INFORMATION & HELPLINES */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Safety & Emergency Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              24/7 Traveler Emergency Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Quick one-tap contact numbers for tourist police, hospitals, women safety, and transport helpdesks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EMERGENCY_CONTACTS.map((contact, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-rose-200 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">{contact.name}</span>
                  </div>

                  <p className="text-xs text-slate-500 mb-3 leading-snug">{contact.desc}</p>
                </div>

                <a
                  href={`tel:${contact.number.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {contact.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
