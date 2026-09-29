export type TransportType = 'flight' | 'train' | 'bus' | 'cab';
export type TripType = 'roundTrip' | 'oneWay';

export interface SearchQuery {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  tripType: TripType;
}

export interface TransportOption {
  id: string;
  type: TransportType;
  operator: string;
  operatorLogo?: string;
  code: string;
  departureTime: string;
  arrivalTime: string;
  departureCity: string;
  departureStation: string;
  arrivalCity: string;
  arrivalStation: string;
  duration: string;
  durationMinutes: number;
  stops: string;
  stopsCount: number;
  price: number;
  originalPrice: number;
  classAvailability: string;
  classes: {
    name: string;
    price: number;
    seatsLeft: number;
    benefits: string[];
  }[];
  rating: number;
  reviewsCount: number;
  amenities: string[];
  cancellationPolicy: string;
  badge?: string;
}

export interface HotelRoom {
  id: string;
  name: string;
  bedType: string;
  size: string;
  maxGuests: number;
  pricePerNight: number;
  features: string[];
}

export interface HotelReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  tripType: string;
}

export interface HotelOption {
  id: string;
  name: string;
  destination: string;
  location: string;
  rating: number;
  reviewsCount: number;
  hotelType: 'Luxury Resort' | 'Boutique Villa' | 'Beachfront Stay' | 'Heritage' | 'Budget Friendly';
  pricePerNight: number;
  originalPricePerNight: number;
  image: string;
  gallery: string[];
  amenities: string[];
  cancellationPolicy: string;
  checkIn: string;
  checkOut: string;
  distanceToBeach: string;
  distanceToTransit: string;
  description: string;
  rooms: HotelRoom[];
  reviews: HotelReview[];
}

export interface ActivityItem {
  id: string;
  time: string;
  title: string;
  location: string;
  tag: 'Travel' | 'Hotel' | 'Sightseeing' | 'Food' | 'Adventure' | 'Leisure' | 'Historical' | 'Beach';
  description: string;
  cost: number;
  duration: string;
  image?: string;
}

export interface DayItinerary {
  dayNumber: number;
  date: string;
  title: string;
  subtitle: string;
  activities: ActivityItem[];
}

export interface Attraction {
  id: string;
  destination: string;
  name: string;
  category: 'Popular' | 'Hidden Gem' | 'Beach' | 'Historical' | 'Adventure';
  image: string;
  description: string;
  entryFee: string;
  openingHours: string;
  bestTime: string;
  recommendedDuration: string;
  highlights: string[];
}

export interface Restaurant {
  id: string;
  destination: string;
  name: string;
  cuisine: string;
  priceRange: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  rating: number;
  reviewsCount: number;
  specialty: string;
  location: string;
  mustTry: string[];
  timing: string;
}

export interface LocalTransportOption {
  id: string;
  vehicle: string;
  priceEstimate: string;
  type: string;
  pros: string;
  bookingTip: string;
}

export interface ChecklistItem {
  id: string;
  category: 'Documents' | 'Clothing' | 'Electronics' | 'Health & Toiletries' | 'Cash & Cards';
  item: string;
  completed: boolean;
}

export interface BookingConfirmation {
  id: string;
  bookingType: 'transport' | 'hotel';
  title: string;
  subtitle: string;
  bookingDate: string;
  travelDates: string;
  amount: number;
  status: 'Confirmed' | 'Completed';
  referenceNumber: string;
  details: {
    operatorOrHotel: string;
    routeOrLocation: string;
    passengersOrGuests: string;
    classOrRoom: string;
    seatOrRoomNo?: string;
  };
}
