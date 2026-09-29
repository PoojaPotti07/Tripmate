import React from 'react';
import { Bike, Car, Bus, Ship, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import { MOCK_LOCAL_TRANSPORT } from '../data/mockData';

interface LocalTransportGuideProps {
  destination: string;
}

export const LocalTransportGuide: React.FC<LocalTransportGuideProps> = ({ destination }) => {
  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
            <span>Step 5 · Local Commute & Rentals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Getting Around in {destination.split(',')[0]}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Everything you need to know about self-drive two-wheelers, official app taxis, and scenic river ferries.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {MOCK_LOCAL_TRANSPORT.map((opt) => (
            <div
              key={opt.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
                    {opt.vehicle.includes('Activa') ? (
                      <Bike className="w-5 h-5" />
                    ) : opt.vehicle.includes('Royal') ? (
                      <Bike className="w-5 h-5" />
                    ) : opt.vehicle.includes('Taxi') ? (
                      <Car className="w-5 h-5" />
                    ) : opt.vehicle.includes('Ferries') ? (
                      <Ship className="w-5 h-5" />
                    ) : (
                      <Bus className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-extrabold text-teal-800 font-mono">
                    {opt.priceEstimate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{opt.vehicle}</h3>
                <div className="text-xs text-teal-700 font-semibold mt-0.5">{opt.type}</div>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{opt.pros}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[11px] font-bold text-slate-700 block mb-0.5">Booking Tip:</span>
                <p className="text-[11px] text-slate-500 leading-snug">{opt.bookingTip}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Local Transit Advisory Notice */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 flex items-start gap-3.5">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-900">
            <h4 className="font-bold text-sm">Essential Local Commute Rules</h4>
            <ul className="list-disc list-inside space-y-1 text-amber-800">
              <li>
                <strong>Helmets Mandatory:</strong> Strict traffic surveillance across all state highways and bridges (fines apply for both rider & pillion).
              </li>
              <li>
                <strong>Official Taxi Rates:</strong> Use the government-backed <em>GoaMiles</em> app for meter-regulated taxi fares to avoid overpaying at private stands.
              </li>
              <li>
                <strong>Free River Ferries:</strong> Vehicle and passenger ferries across Panaji-Betim and Ribandar-Chorao are completely free for pedestrians!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
