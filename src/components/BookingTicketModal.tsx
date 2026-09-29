import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Ticket,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  QrCode,
  Download,
  Printer,
  ShieldCheck,
  Tag,
  ArrowRight,
  Plane,
  Bed,
  Train,
  Bus,
  Car
} from 'lucide-react';
import {
  TransportOption,
  HotelOption,
  HotelRoom,
  BookingConfirmation,
  SearchQuery
} from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface BookingTicketModalProps {
  bookingItem: {
    type: 'transport' | 'hotel';
    transport?: TransportOption;
    selectedClass?: string;
    hotel?: HotelOption;
    selectedRoom?: HotelRoom;
  };
  query: SearchQuery;
  onClose: () => void;
  onConfirmBooking: (confirmation: BookingConfirmation) => void;
}

export const BookingTicketModal: React.FC<BookingTicketModalProps> = ({
  bookingItem,
  query,
  onClose,
  onConfirmBooking,
}) => {
  // Passenger Form State
  const [leadName, setLeadName] = useState('Pooja Pottipooja');
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState('Female');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('pottipooja000@gmail.com');
  const [seatPreference, setSeatPreference] = useState('Window Seat');

  // Coupon State
  const [couponCode, setCouponCode] = useState('TRIPMATE20');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Confirmation state
  const [confirmedData, setConfirmedData] = useState<BookingConfirmation | null>(null);

  // Pricing calculations
  const isTransport = bookingItem.type === 'transport';
  const travelers = query.travelers || 2;

  const dep = new Date(query.departureDate || '2026-10-15');
  const ret = new Date(query.returnDate || '2026-10-20');
  const diffTime = Math.abs(ret.getTime() - dep.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) || 5;

  const basePrice = isTransport
    ? (bookingItem.transport?.classes.find((c) => c.name === bookingItem.selectedClass)?.price ||
        bookingItem.transport?.price ||
        4850) * travelers
    : (bookingItem.selectedRoom?.pricePerNight || bookingItem.hotel?.pricePerNight || 4200) * nights;

  const discountAmount = couponApplied ? Math.round(basePrice * 0.2) : 0;
  const taxesAndFees = Math.round((basePrice - discountAmount) * 0.12);
  const finalPayable = basePrice - discountAmount + taxesAndFees;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'TRIPMATE20') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon. Try TRIPMATE20 for 20% off.');
    }
  };

  const handleProceedPayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    const pnr = `TM-${Math.floor(100000 + Math.random() * 900000)}`;

    const confirmation: BookingConfirmation = {
      id: `bk-${Date.now()}`,
      bookingType: bookingItem.type,
      title: isTransport
        ? `${bookingItem.transport?.operator} (${bookingItem.transport?.code})`
        : `${bookingItem.hotel?.name}`,
      subtitle: isTransport
        ? `${query.from.split(',')[0]} → ${query.to.split(',')[0]}`
        : `${nights} Nights · ${bookingItem.selectedRoom?.name || 'Deluxe Room'}`,
      bookingDate: new Date().toLocaleDateString('en-GB'),
      travelDates: `${query.departureDate} ${query.returnDate ? `– ${query.returnDate}` : ''}`,
      amount: finalPayable,
      status: 'Confirmed',
      referenceNumber: pnr,
      details: {
        operatorOrHotel: isTransport
          ? bookingItem.transport?.operator || ''
          : bookingItem.hotel?.name || '',
        routeOrLocation: isTransport
          ? `${bookingItem.transport?.departureStation} → ${bookingItem.transport?.arrivalStation}`
          : bookingItem.hotel?.location || '',
        passengersOrGuests: `${leadName} (${travelers} Guest${travelers > 1 ? 's' : ''})`,
        classOrRoom: isTransport
          ? `${bookingItem.selectedClass || 'Economy'}`
          : `${bookingItem.selectedRoom?.name || 'Deluxe Room'}`,
        seatOrRoomNo: isTransport ? `Seat 12A, 12B (${seatPreference})` : `Room 304 (Ocean Wing)`,
      },
    };

    setConfirmedData(confirmation);
    onConfirmBooking(confirmation);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Sticky Header */}
        <div className="bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
              {isTransport ? <Ticket className="w-4 h-4" /> : <Bed className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {confirmedData ? 'Booking Confirmed!' : `Complete Your ${isTransport ? 'Ticket' : 'Hotel'} Booking`}
              </h2>
              <div className="text-[11px] text-slate-500">
                {isTransport
                  ? `${bookingItem.transport?.operator} · ${query.from.split(',')[0]} to ${query.to.split(',')[0]}`
                  : `${bookingItem.hotel?.name}`}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {confirmedData ? (
            /* CONFIRMED E-TICKET / BOARDING PASS */
            <div className="space-y-6">
              <div className="text-center py-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-emerald-900">Your Booking is Confirmed!</h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Instant confirmation voucher sent to <strong>{email}</strong> and SMS to <strong>{phone}</strong>.
                </p>
              </div>

              {/* Digital E-Ticket Pass Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xl border border-slate-800">
                {/* Visual cutout notches on ticket sides */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />

                {/* Ticket Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-slate-900 font-bold">
                      TM
                    </div>
                    <span className="text-sm font-bold tracking-tight">TripMate Boarding Pass</span>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">PNR / Ref</div>
                    <div className="text-xs font-mono font-extrabold text-teal-400 tracking-wider">
                      {confirmedData.referenceNumber}
                    </div>
                  </div>
                </div>

                {/* Route / Service Details */}
                <div className="py-4">
                  <div className="text-xs text-teal-300 font-semibold mb-1">
                    {confirmedData.details.operatorOrHotel}
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-white">
                    {confirmedData.details.routeOrLocation}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Dates: {confirmedData.travelDates}
                  </div>
                </div>

                {/* Passenger / Room Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-t border-b border-slate-700/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Passenger</span>
                    <span className="font-semibold text-white truncate block">{leadName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Category</span>
                    <span className="font-semibold text-teal-300 block">{confirmedData.details.classOrRoom}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Seat / Room</span>
                    <span className="font-semibold text-white block">{confirmedData.details.seatOrRoomNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Status</span>
                    <span className="font-semibold text-emerald-400 block">Confirmed (Paid)</span>
                  </div>
                </div>

                {/* Ticket Footer with Barcode simulation */}
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">Total Paid Amount</div>
                    <div className="text-lg font-bold font-mono text-white">
                      {formatCurrency(confirmedData.amount)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                    <QrCode className="w-6 h-6 text-teal-300" />
                    <span className="text-[10px] font-mono text-slate-300">Scan at Gate / Check-in</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <Printer className="w-4 h-4 text-teal-600" />
                  <span>Print E-Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
                >
                  Done & Return to Trip
                </button>
              </div>
            </div>
          ) : (
            /* BOOKING INPUT FORM */
            <form onSubmit={handleProceedPayment} className="space-y-5">
              {/* Item Summary Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                    {isTransport ? 'Selected Transit' : 'Selected Hotel'}
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {isTransport ? bookingItem.transport?.operator : bookingItem.hotel?.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {isTransport
                      ? `${bookingItem.selectedClass || 'Economy'} · ${bookingItem.transport?.departureTime} to ${bookingItem.transport?.arrivalTime}`
                      : `${nights} Nights · ${bookingItem.selectedRoom?.name || 'Deluxe Room'}`}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-teal-800 font-mono">
                    {formatCurrency(basePrice)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    for {travelers} Traveler{travelers > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Primary Traveler Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Full Name (as per Govt ID)
                    </label>
                    <input
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  {isTransport && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Seat Preference
                      </label>
                      <select
                        value={seatPreference}
                        onChange={(e) => setSeatPreference(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="Window Seat">Window Seat</option>
                        <option value="Aisle Seat">Aisle Seat</option>
                        <option value="Lower Berth (Train/Bus)">Lower Berth</option>
                        <option value="Upper Berth (Train/Bus)">Upper Berth</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Promo Code Box */}
              <div className="p-3.5 bg-teal-50/50 rounded-2xl border border-teal-200/60">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-xs font-bold text-teal-900">Have a Promo Coupon?</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-1.5 text-xs uppercase font-mono font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-100 hover:bg-teal-200 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {couponApplied && (
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 20% Discount Applied Successfully!
                  </p>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 text-xs border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Base Fare ({travelers} Travelers)</span>
                  <span className="font-mono">{formatCurrency(basePrice)}</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount (20%)</span>
                    <span className="font-mono">- {formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Taxes & GST (12%)</span>
                  <span className="font-mono">{formatCurrency(taxesAndFees)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Payable</span>
                  <span className="font-mono text-teal-800 text-base">
                    {formatCurrency(finalPayable)}
                  </span>
                </div>
              </div>

              {/* Confirm CTA */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all"
              >
                <span>Confirm & Issue E-Ticket ({formatCurrency(finalPayable)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
