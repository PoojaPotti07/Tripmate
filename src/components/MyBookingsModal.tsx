import React from 'react';
import { X, Ticket, Bed, QrCode, Printer, CheckCircle, Calendar, MapPin } from 'lucide-react';
import { BookingConfirmation } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface MyBookingsModalProps {
  bookings: BookingConfirmation[];
  onClose: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({ bookings, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">My TripMate Bookings</h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Confirmed Bookings Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                When you book flights, trains, buses, outstation cabs, or resort hotels, your live passes and confirmation vouchers will appear here.
              </p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-teal-700 font-bold shrink-0">
                      {b.bookingType === 'transport' ? <Ticket className="w-4 h-4" /> : <Bed className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {b.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{b.subtitle}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">PNR / Ref</span>
                    <span className="text-xs font-mono font-bold text-teal-800 tracking-wider">
                      {b.referenceNumber}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-3 text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Guest / Passenger</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {b.details.passengersOrGuests}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Category</span>
                    <span className="font-semibold text-slate-800 block">{b.details.classOrRoom}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Seat / Room</span>
                    <span className="font-semibold text-slate-800 block">
                      {b.details.seatOrRoomNo || 'Assigned at check-in'}
                    </span>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Paid: <strong className="font-mono text-slate-900">{formatCurrency(b.amount)}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-teal-600" />
                    <span>Print Pass</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
