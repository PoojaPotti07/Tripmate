import {
  TransportOption,
  HotelOption,
  DayItinerary,
  Attraction,
  Restaurant,
  LocalTransportOption,
  ChecklistItem
} from '../types/travel';

export const HERO_IMAGE = '/src/assets/images/hero_travel_coast_1790688507956.jpg';
export const GOA_BEACH_IMAGE = '/src/assets/images/dest_goa_beach_1790688525078.jpg';
export const HYDERABAD_IMAGE = '/src/assets/images/dest_hyderabad_charminar_1790688539959.jpg';
export const KERALA_IMAGE = '/src/assets/images/dest_kerala_backwaters_1790688554733.jpg';
export const LUXURY_HOTEL_IMAGE = '/src/assets/images/hotel_luxury_resort_1790688567693.jpg';

export interface DestinationCard {
  name: string;
  state: string;
  tagline: string;
  image: string;
  weather: string;
  startingPrice: number;
}

export const POPULAR_DESTINATIONS: DestinationCard[] = [
  {
    name: 'Goa',
    state: 'Goa',
    tagline: 'Sun, Golden Sand & Portuguese Heritage',
    image: GOA_BEACH_IMAGE,
    weather: '29°C · Sunny',
    startingPrice: 3499
  },
  {
    name: 'Hyderabad',
    state: 'Telangana',
    tagline: 'City of Pearls & Royal Nizami Biryani',
    image: HYDERABAD_IMAGE,
    weather: '27°C · Pleasant',
    startingPrice: 2199
  },
  {
    name: 'Kerala',
    state: 'Kerala',
    tagline: 'Emerald Backwaters & Serene Tea Hills',
    image: KERALA_IMAGE,
    weather: '26°C · Tropical',
    startingPrice: 3899
  },
  {
    name: 'Bengaluru',
    state: 'Karnataka',
    tagline: 'Silicon Garden & Craft Breweries',
    image: HERO_IMAGE,
    weather: '24°C · Breezy',
    startingPrice: 2499
  },
  {
    name: 'Chennai',
    state: 'Tamil Nadu',
    tagline: 'Marina Coast, Carnatic Culture & Temples',
    image: GOA_BEACH_IMAGE,
    weather: '30°C · Coastal',
    startingPrice: 2299
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    tagline: 'City of Dreams & Arabian Sea Promenade',
    image: HYDERABAD_IMAGE,
    weather: '28°C · Humid',
    startingPrice: 3200
  },
  {
    name: 'Delhi',
    state: 'Delhi NCR',
    tagline: 'Mughal Architecture & Street Food Haven',
    image: HYDERABAD_IMAGE,
    weather: '25°C · Clear',
    startingPrice: 3600
  },
  {
    name: 'Rajasthan',
    state: 'Rajasthan',
    tagline: 'Golden Sand Forts & Royal Palaces',
    image: KERALA_IMAGE,
    weather: '28°C · Dry Sunny',
    startingPrice: 4200
  }
];

export const MOCK_TRANSPORTS: TransportOption[] = [
  // FLIGHTS (via nearby airport Visakhapatnam VTZ connecting Srikakulam travellers)
  {
    id: 'fl-1',
    type: 'flight',
    operator: 'IndiGo Airlines',
    code: '6E 2148 / 6E 5321',
    departureTime: '07:15 AM',
    arrivalTime: '12:35 PM',
    departureCity: 'Srikakulam (via VTZ)',
    departureStation: 'Visakhapatnam Intl (VTZ)',
    arrivalCity: 'Goa',
    arrivalStation: 'Manohar Intl Airport Mopa (GOX)',
    duration: '5h 20m',
    durationMinutes: 320,
    stops: '1 Stop via HYD (1h 15m layover)',
    stopsCount: 1,
    price: 4850,
    originalPrice: 6200,
    classAvailability: 'Economy · 4 seats left at this fare',
    classes: [
      { name: 'Economy Saver', price: 4850, seatsLeft: 4, benefits: ['Hand baggage 7kg', 'Check-in 15kg', 'Standard seat'] },
      { name: 'Flexi Plus', price: 5690, seatsLeft: 9, benefits: ['Free seat selection', 'Complimentary sandwich', 'Low cancellation fee'] }
    ],
    rating: 4.6,
    reviewsCount: 1420,
    amenities: ['15kg Check-in', 'USB Charger', 'Web Check-in', 'Snack Bar'],
    cancellationPolicy: 'Refundable up to 2 hours before departure (fee applies)',
    badge: 'Fastest Transit'
  },
  {
    id: 'fl-2',
    type: 'flight',
    operator: 'Air India',
    code: 'AI 854 / AI 680',
    departureTime: '09:40 AM',
    arrivalTime: '03:50 PM',
    departureCity: 'Srikakulam (via VTZ)',
    departureStation: 'Visakhapatnam Intl (VTZ)',
    arrivalCity: 'Goa',
    arrivalStation: 'Dabolim Airport (GOI)',
    duration: '6h 10m',
    durationMinutes: 370,
    stops: '1 Stop via BLR (1h 40m layover)',
    stopsCount: 1,
    price: 5290,
    originalPrice: 6800,
    classAvailability: 'Economy · Hot Meal included',
    classes: [
      { name: 'Comfort Economy', price: 5290, seatsLeft: 6, benefits: ['Free Hot Meal', 'Check-in 20kg', 'Pre-allocated seat'] },
      { name: 'Business Comfort', price: 12400, seatsLeft: 2, benefits: ['Lounge Access', 'Check-in 35kg', 'Priority Boarding'] }
    ],
    rating: 4.4,
    reviewsCount: 980,
    amenities: ['Hot Meal Included', '20kg Luggage', 'In-flight Entertainment', 'Spacious Legroom'],
    cancellationPolicy: 'Free date change up to 48 hours before flight',
    badge: 'Meal Included'
  },
  {
    id: 'fl-3',
    type: 'flight',
    operator: 'SpiceJet Express',
    code: 'SG 1083 / SG 3004',
    departureTime: '01:25 PM',
    arrivalTime: '07:45 PM',
    departureCity: 'Srikakulam (via VTZ)',
    departureStation: 'Visakhapatnam Intl (VTZ)',
    arrivalCity: 'Goa',
    arrivalStation: 'Manohar Intl Airport Mopa (GOX)',
    duration: '6h 20m',
    durationMinutes: 380,
    stops: '1 Stop via BOM (1h 50m layover)',
    stopsCount: 1,
    price: 4320,
    originalPrice: 5500,
    classAvailability: 'Economy · 7 seats left',
    classes: [
      { name: 'Standard Saver', price: 4320, seatsLeft: 7, benefits: ['Hand baggage 7kg', 'Check-in 15kg'] },
      { name: 'SpiceMax', price: 5350, seatsLeft: 3, benefits: ['Extra legroom', 'Priority check-in', 'Free drink'] }
    ],
    rating: 4.2,
    reviewsCount: 810,
    amenities: ['15kg Baggage', 'Cabin AC', 'Buy-on-board Snacks'],
    cancellationPolicy: 'Standard airline cancellation deductions apply',
    badge: 'Cheapest Airfare'
  },

  // TRAINS (direct / single interchange routes from Srikakulam Road CHE)
  {
    id: 'tr-1',
    type: 'train',
    operator: 'Indian Railways (Express)',
    code: '18047 / 12779 Amaravathi Express Link',
    departureTime: '06:40 AM',
    arrivalTime: '01:15 PM (Next Day)',
    departureCity: 'Srikakulam',
    departureStation: 'Srikakulam Road (CHE)',
    arrivalCity: 'Goa',
    arrivalStation: 'Madgaon Junction (MAO)',
    duration: '30h 35m',
    durationMinutes: 1835,
    stops: '12 Major Stations (BZA, GTL, UBL)',
    stopsCount: 12,
    price: 1840,
    originalPrice: 2200,
    classAvailability: '3A (AC 3 Tier) · Available (RAC 4 / Confirmed)',
    classes: [
      { name: 'Sleeper (SL)', price: 710, seatsLeft: 32, benefits: ['Non-AC Berth', 'Standard windows', 'Catering available'] },
      { name: 'AC 3 Tier (3A)', price: 1840, seatsLeft: 18, benefits: ['AC Sleeper', 'Clean Linen & Blanket', 'Charging point'] },
      { name: 'AC 2 Tier (2A)', price: 2680, seatsLeft: 6, benefits: ['Wide Berths', 'Curtains', 'Reading light', 'Linen kit'] }
    ],
    rating: 4.3,
    reviewsCount: 2340,
    amenities: ['Pantry Car', 'Charging Ports', 'Bedroll Provided', 'Security Escort'],
    cancellationPolicy: 'Full refund minus IRCTC clerkage charges up to 48 hours',
    badge: 'Direct Scenic Route'
  },
  {
    id: 'tr-2',
    type: 'train',
    operator: 'Vande Bharat + Konkan Kanya Superfast',
    code: '20833 + 20111 Combo Connect',
    departureTime: '05:45 AM',
    arrivalTime: '09:30 AM (Next Day)',
    departureCity: 'Srikakulam',
    departureStation: 'Srikakulam Road (CHE)',
    arrivalCity: 'Goa',
    arrivalStation: 'Thivim / Madgaon (MAO)',
    duration: '27h 45m',
    durationMinutes: 1665,
    stops: 'Express Halts (HYD / PNVL interchange)',
    stopsCount: 8,
    price: 2450,
    originalPrice: 3100,
    classAvailability: '3A AC · 14 seats available',
    classes: [
      { name: '3A Superfast', price: 2450, seatsLeft: 14, benefits: ['AC Comfort', 'High speed track', 'Modern bio-toilets'] },
      { name: '2A Executive', price: 3420, seatsLeft: 4, benefits: ['Spacious 2-tier', 'Linen included', 'Quiet coach'] }
    ],
    rating: 4.7,
    reviewsCount: 1540,
    amenities: ['High Speed', 'Linen & Blanket', 'Clean Toilets', 'On-board Food'],
    cancellationPolicy: 'Refundable as per standard railway timetable guidelines',
    badge: 'Top Rated Rail'
  },

  // BUSES (Multi-Axle AC Sleeper buses with interchange)
  {
    id: 'bs-1',
    type: 'bus',
    operator: 'Orange Tours & Travels',
    code: 'Scania Multi-Axle AC Sleeper (2+1)',
    departureTime: '04:30 PM',
    arrivalTime: '02:00 PM (Next Day)',
    departureCity: 'Srikakulam',
    departureStation: 'Old Bus Stand, Srikakulam',
    arrivalCity: 'Goa',
    arrivalStation: 'Panjim KTC Bus Stand / Mapusa',
    duration: '21h 30m',
    durationMinutes: 1290,
    stops: 'Via Vijayawada & Belagavi',
    stopsCount: 3,
    price: 2190,
    originalPrice: 2800,
    classAvailability: 'Single Lower Sleeper · 6 berths left',
    classes: [
      { name: 'Upper Single Sleeper', price: 2190, seatsLeft: 6, benefits: ['Privacy curtain', 'USB charging', 'Blanket & pillow'] },
      { name: 'Lower Double Sleeper', price: 2390, seatsLeft: 4, benefits: ['Easy climb', 'Extra cushion', 'Reading light'] }
    ],
    rating: 4.5,
    reviewsCount: 890,
    amenities: ['Individual AC Vents', 'Charging Sockets', 'Bottled Water', 'Live GPS Tracking', 'Blanket & Pillow'],
    cancellationPolicy: 'Free cancellation up to 6 hours before departure',
    badge: 'Popular Bus'
  },
  {
    id: 'bs-2',
    type: 'bus',
    operator: 'SRS Travels Volvo Club Class',
    code: 'Volvo B11R I-Shift Multi-Axle',
    departureTime: '06:00 PM',
    arrivalTime: '03:45 PM (Next Day)',
    departureCity: 'Srikakulam',
    departureStation: 'Seven Hills Junction, Srikakulam',
    arrivalCity: 'Goa',
    arrivalStation: 'Madgaon Kadamba Bus Stand',
    duration: '21h 45m',
    durationMinutes: 1305,
    stops: 'Via Vizag & Hubballi',
    stopsCount: 2,
    price: 1950,
    originalPrice: 2450,
    classAvailability: 'AC Sleeper · 10 berths left',
    classes: [
      { name: 'AC Sleeper Standard', price: 1950, seatsLeft: 10, benefits: ['Soft mattress', 'Clean linen', 'Air suspension'] }
    ],
    rating: 4.3,
    reviewsCount: 650,
    amenities: ['Air Suspension', 'Reading Lights', 'Emergency Exit', 'Water Bottle'],
    cancellationPolicy: '50% refund within 12 hours of departure',
    badge: 'Budget Friendly'
  },

  // CABS (Intercity Outstation Chauffeured Cabs)
  {
    id: 'cb-1',
    type: 'cab',
    operator: 'TripMate Verified Outstation Prime',
    code: 'Toyota Innova Crysta / Ertiga 7-Seater',
    departureTime: 'Flexible (On-Demand)',
    arrivalTime: 'Door-to-Door Service',
    departureCity: 'Srikakulam',
    departureStation: 'Doorstep Pickup anywhere in Srikakulam',
    arrivalCity: 'Goa',
    arrivalStation: 'Direct Drop at Resort / Hotel in Goa',
    duration: '22h 00m (with rest breaks)',
    durationMinutes: 1320,
    stops: 'Unlimited scenic rest & meal stops on your schedule',
    stopsCount: 0,
    price: 18500,
    originalPrice: 22000,
    classAvailability: 'Private SUV for your group · Instant Confirm',
    classes: [
      { name: 'Prime Sedan (Dzire / Etios)', price: 14200, seatsLeft: 3, benefits: ['Up to 4 passengers', 'Luggage 3 bags', 'Toll & tax included'] },
      { name: 'Prime SUV (Innova Crysta)', price: 18500, seatsLeft: 2, benefits: ['Up to 6 passengers', 'Captain seats', 'Roof carrier'] }
    ],
    rating: 4.9,
    reviewsCount: 420,
    amenities: ['Chauffeur Driven', 'Air Conditioned', 'Doorstep Pickup', 'Luggage Assistance', 'All Tolls & Taxes Included'],
    cancellationPolicy: 'Zero cancellation fee up to 12 hours before pickup',
    badge: 'Maximum Comfort'
  }
];

export const MOCK_HOTELS: HotelOption[] = [
  {
    id: 'ht-1',
    name: 'The Heritage Palms Seaside Resort & Spa',
    destination: 'Goa',
    location: 'Sinquerim Beach, Candolim, North Goa',
    rating: 4.8,
    reviewsCount: 1640,
    hotelType: 'Luxury Resort',
    pricePerNight: 5400,
    originalPricePerNight: 7200,
    image: LUXURY_HOTEL_IMAGE,
    gallery: [
      LUXURY_HOTEL_IMAGE,
      GOA_BEACH_IMAGE,
      HERO_IMAGE
    ],
    amenities: [
      'Breakfast included',
      'Free cancellation',
      'AC',
      'Wi-Fi',
      'Swimming pool',
      'Parking',
      'Sea view',
      'Spa & Ayurveda',
      'Beach Access'
    ],
    cancellationPolicy: 'Free cancellation until 48 hours before check-in',
    checkIn: '02:00 PM',
    checkOut: '11:00 AM',
    distanceToBeach: '120m from Sinquerim Beach (Private walkway)',
    distanceToTransit: '24 km from Mopa Airport / 12 km from Thivim Railway',
    description: 'Perched along the golden shores of North Goa, The Heritage Palms seamlessly blends Portuguese colonial architecture with five-star modern coastal luxury. Features an oceanfront infinity pool, curated spa treatments, and candlelit seafood dining under swaying palms.',
    rooms: [
      {
        id: 'rm-1',
        name: 'Deluxe Ocean View Room',
        bedType: '1 King Bed or 2 Twins',
        size: '38 sq m',
        maxGuests: 2,
        pricePerNight: 5400,
        features: ['Private Balcony with Sea View', 'Complimentary Buffet Breakfast', 'Rain Shower', 'Free High-speed Wi-Fi', 'Coffee Machine']
      },
      {
        id: 'rm-2',
        name: 'Royal Heritage Villa with Plunge Pool',
        bedType: '1 King Four-Poster Bed',
        size: '64 sq m',
        maxGuests: 3,
        pricePerNight: 8900,
        features: ['Private Plunge Pool', 'Living Pavilion', 'Free Champagne on Arrival', '24/7 Butler Service', 'Bathtub']
      }
    ],
    reviews: [
      {
        id: 'rv-1',
        author: 'Sunil & Priya Verma',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Outstanding hospitality! The view of the sunset from the infinity pool was unreal. The breakfast spread has both traditional South Indian treats and continental delights.',
        tripType: 'Couple Trip'
      },
      {
        id: 'rv-2',
        author: 'David Richardson',
        rating: 4.8,
        date: 'Last month',
        comment: 'Very quiet and relaxing atmosphere away from loud party zones, yet only 10 minutes to Calangute. Rooms are spotless.',
        tripType: 'Solo Traveler'
      }
    ]
  },
  {
    id: 'ht-2',
    name: 'Casa Mar Bella Boutique Beachfront Villa',
    destination: 'Goa',
    location: 'Ashvem Beach Road, Morjim, North Goa',
    rating: 4.7,
    reviewsCount: 920,
    hotelType: 'Boutique Villa',
    pricePerNight: 3950,
    originalPricePerNight: 5100,
    image: GOA_BEACH_IMAGE,
    gallery: [
      GOA_BEACH_IMAGE,
      LUXURY_HOTEL_IMAGE,
      HERO_IMAGE
    ],
    amenities: [
      'Breakfast included',
      'Free cancellation',
      'AC',
      'Wi-Fi',
      'Swimming pool',
      'Parking',
      'Yoga Deck',
      'Bar & Shack'
    ],
    cancellationPolicy: 'Free cancellation until 24 hours prior',
    checkIn: '01:00 PM',
    checkOut: '11:00 AM',
    distanceToBeach: 'Step directly onto Ashvem Beach white sands',
    distanceToTransit: '22 km from Mopa Airport (GOX)',
    description: 'Chic bohemian sanctuary right on tranquil Ashvem Beach. Known for organic farm-to-table breakfast, morning yoga sessions overlooking the Arabian Sea, and artisan cocktail evenings.',
    rooms: [
      {
        id: 'rm-3',
        name: 'Bohemian Sea Breeze Cottage',
        bedType: '1 King Bed',
        size: '32 sq m',
        maxGuests: 2,
        pricePerNight: 3950,
        features: ['Open-air Tropical Shower', 'Outdoor Hammock', 'Artisan Decor', 'Daily Fresh Coconut Drink']
      }
    ],
    reviews: [
      {
        id: 'rv-3',
        author: 'Ananya Roy',
        rating: 4.9,
        date: '3 weeks ago',
        comment: 'Waking up to the sound of waves was meditative. Ashvem is much calmer than Baga. Highly recommended for couples!',
        tripType: 'Romantic Getaway'
      }
    ]
  },
  {
    id: 'ht-3',
    name: 'Zostel Plus Beachside Haven',
    destination: 'Goa',
    location: 'Near Calangute Circle, North Goa',
    rating: 4.5,
    reviewsCount: 2180,
    hotelType: 'Budget Friendly',
    pricePerNight: 1650,
    originalPricePerNight: 2300,
    image: HERO_IMAGE,
    gallery: [
      HERO_IMAGE,
      GOA_BEACH_IMAGE
    ],
    amenities: [
      'AC',
      'Wi-Fi',
      'Swimming pool',
      'Parking',
      'Game Room',
      'Cafe & Coworking',
      'Free cancellation'
    ],
    cancellationPolicy: 'Free cancellation up to 24 hours',
    checkIn: '02:00 PM',
    checkOut: '10:30 AM',
    distanceToBeach: '400m from Calangute Beach',
    distanceToTransit: '14 km from Thivim Railway Station',
    description: 'Lively community-driven retreat with private rooms and vibrant social areas. Features a swimming pool, rooftop cafe, co-working desks, and organized beach walks.',
    rooms: [
      {
        id: 'rm-4',
        name: 'Private Deluxe King Room',
        bedType: '1 King Bed',
        size: '26 sq m',
        maxGuests: 2,
        pricePerNight: 1650,
        features: ['Private En-suite Bathroom', 'Work Desk', 'AC', 'High Speed Wi-Fi']
      }
    ],
    reviews: [
      {
        id: 'rv-4',
        author: 'Rohan Sharma',
        rating: 4.6,
        date: '5 days ago',
        comment: 'Met awesome fellow travelers here! Super clean, fast wifi for working, and great food at the rooftop cafe.',
        tripType: 'Friends Trip'
      }
    ]
  },
  {
    id: 'ht-4',
    name: 'Quinta Da Terra Portuguese Colonial Estate',
    destination: 'Goa',
    location: 'Fontainhas Latin Quarter, Panaji',
    rating: 4.9,
    reviewsCount: 780,
    hotelType: 'Heritage',
    pricePerNight: 4600,
    originalPricePerNight: 5900,
    image: HYDERABAD_IMAGE,
    gallery: [
      HYDERABAD_IMAGE,
      LUXURY_HOTEL_IMAGE
    ],
    amenities: [
      'Breakfast included',
      'Free cancellation',
      'AC',
      'Wi-Fi',
      'Parking',
      'Courtyard Garden',
      'Antique Library'
    ],
    cancellationPolicy: 'Free cancellation up to 72 hours before check-in',
    checkIn: '02:00 PM',
    checkOut: '12:00 PM',
    distanceToBeach: '3 km from Miramar Beach',
    distanceToTransit: '30 km from Dabolim Airport / 1 km from Panjim Jetty',
    description: 'A restored 18th-century Portuguese manor in the heart of the UNESCO-nominated Latin Quarter. Filled with Azulejo ceramic tiles, teak antique furnishings, and courtyard jasmine trees.',
    rooms: [
      {
        id: 'rm-5',
        name: 'Heritage Balcao Suite',
        bedType: '1 Four Poster Antique King',
        size: '42 sq m',
        maxGuests: 2,
        pricePerNight: 4600,
        features: ['Traditional Balcony (Balcão)', 'Clawfoot Tub', 'Authentic Goan Breakfast', 'Vintage gramophone']
      }
    ],
    reviews: [
      {
        id: 'rv-5',
        author: 'Carlos & Meera',
        rating: 5,
        date: '1 month ago',
        comment: 'An absolute masterpiece of preservation. Walking around Fontainhas in the evening feels like stepping into Lisbon.',
        tripType: 'Heritage Enthusiasts'
      }
    ]
  }
];

export const DEFAULT_ITINERARY: DayItinerary[] = [
  {
    dayNumber: 1,
    date: '15 Oct',
    title: 'Day 1 — Arrival in Goa & Sunset Beach Shack',
    subtitle: 'Smooth transit from Srikakulam, hotel check-in & relaxing sea breeze',
    activities: [
      {
        id: 'act-1-1',
        time: '07:15 AM',
        title: 'Morning Flight / Train Departure',
        location: 'Departing from Srikakulam / Visakhapatnam (VTZ)',
        tag: 'Travel',
        description: 'Board your comfortable transit connecting Srikakulam to Goa with scenic vistas along the route.',
        cost: 0,
        duration: '5 hours'
      },
      {
        id: 'act-1-2',
        time: '01:30 PM',
        title: 'Welcome to Goa & Airport/Station Transfer',
        location: 'Arrival at Goa (Mopa GOX / Dabolim GOI)',
        tag: 'Travel',
        description: 'Chauffeured pickup or pre-paid cab straight toward Candolim coastal resort through lush palm groves.',
        cost: 1100,
        duration: '1 hr 15m'
      },
      {
        id: 'act-1-3',
        time: '03:00 PM',
        title: 'Resort Check-in & Freshen Up',
        location: 'The Heritage Palms Resort, Candolim',
        tag: 'Hotel',
        description: 'Receive traditional coconut welcome drink, unpack in your ocean-view room, and take a refreshing dip in the infinity pool.',
        cost: 0,
        duration: '1 hr 30m'
      },
      {
        id: 'act-1-4',
        time: '05:30 PM',
        title: 'Golden Sunset at Candolim Beach',
        location: 'Candolim Beach Shoreline',
        tag: 'Leisure',
        description: 'Take a barefoot stroll along the peaceful shoreline while listening to gentle waves as the sun melts into the Arabian Sea.',
        cost: 0,
        duration: '1 hr 30m'
      },
      {
        id: 'act-1-5',
        time: '07:45 PM',
        title: 'Seaside Shack Dinner with Live Acoustic Music',
        location: 'Calamari Bathe & Binge or Fisherman’s Cove',
        tag: 'Food',
        description: 'Savor fresh grilled kingfish, garlic butter prawns, authentic Goan poi bread, and chilled Sol Kadhi accompanied by live acoustic tunes.',
        cost: 1400,
        duration: '2 hours'
      }
    ]
  },
  {
    dayNumber: 2,
    date: '16 Oct',
    title: 'Day 2 — North Goa Forts, Panoramic Views & Baga Buzz',
    subtitle: 'Colonial 17th-century fortifications, lively beaches, and coastal cafes',
    activities: [
      {
        id: 'act-2-1',
        time: '08:30 AM',
        title: 'Buffet Breakfast at Resort Garden',
        location: 'The Heritage Palms Cafe',
        tag: 'Food',
        description: 'Enjoy tropical fruits, freshly brewed Coorg coffee, eggs made-to-order, and Goan bebinca pastries.',
        cost: 0,
        duration: '1 hour'
      },
      {
        id: 'act-2-2',
        time: '10:00 AM',
        title: 'Explore Historic Fort Aguada & 4-Story Lighthouse',
        location: 'Sinquerim Hill, Candolim',
        tag: 'Historical',
        description: 'Walk through the 1612 Portuguese bastion that once defended Goa. Incredible panoramic view overlooking the Arabian Sea and Aguada jail museum.',
        cost: 50,
        duration: '2 hours'
      },
      {
        id: 'act-2-3',
        time: '12:30 PM',
        title: 'Calangute Beach Promenade & Beachside Lunch',
        location: 'Souza Lobo Restaurant, Calangute',
        tag: 'Food',
        description: 'Try legendary Goan Prawn Curry with red rice and masala fried calamari at this iconic restaurant running since 1932.',
        cost: 1200,
        duration: '1 hr 30m'
      },
      {
        id: 'act-2-4',
        time: '03:00 PM',
        title: 'Baga Beach Vibrance & Water Sports',
        location: 'Baga Beach',
        tag: 'Adventure',
        description: 'Experience thrilling parasailing with a birds-eye view of the coastline, jet ski rides, and banana boat rides under certified safety guides.',
        cost: 1800,
        duration: '2 hr 30m'
      },
      {
        id: 'act-2-5',
        time: '06:30 PM',
        title: 'Sunset Cocktails & Nightlife at Tito’s Lane',
        location: 'Baga Night Market & Tito’s Lane',
        tag: 'Leisure',
        description: 'Browse beach souvenir stalls, handicraft shops, and enjoy mocktails with upbeat ambient music.',
        cost: 800,
        duration: '2 hr 30m'
      }
    ]
  },
  {
    dayNumber: 3,
    date: '17 Oct',
    title: 'Day 3 — Old Goa UNESCO Heritage & Latin Quarter Romance',
    subtitle: 'Baroque churches, cobblestone alleys in Fontainhas, and Mandovi river cruise',
    activities: [
      {
        id: 'act-3-1',
        time: '09:00 AM',
        title: 'Basilica of Bom Jesus & Se Cathedral',
        location: 'Old Goa (Velha Goa)',
        tag: 'Historical',
        description: 'Marvel at 400-year-old UNESCO World Heritage basilica housing the sacred relics of St. Francis Xavier, and the grand Golden Bell of Se Cathedral.',
        cost: 0,
        duration: '2 hours'
      },
      {
        id: 'act-3-2',
        time: '11:45 AM',
        title: 'Walking Photography Tour of Fontainhas Latin Quarter',
        location: 'Fontainhas, Panaji',
        tag: 'Sightseeing',
        description: 'Wander past vivid mustard-yellow and pastel blue Portuguese villas, tiled roof overhangs, and quaint art studios in Asia’s oldest Latin Quarter.',
        cost: 0,
        duration: '1 hr 30m'
      },
      {
        id: 'act-3-3',
        time: '01:30 PM',
        title: 'Authentic Heritage Lunch at Viva Panjim',
        location: '178 Mary Immaculate Church lane, Fontainhas',
        tag: 'Food',
        description: 'Taste authentic family-recipe Goan Pork or Mushroom Vindaloo, Crab Xec Xec, and warm Serradura dessert inside an intimate Portuguese cottage.',
        cost: 950,
        duration: '1 hr 30m'
      },
      {
        id: 'act-3-4',
        time: '04:00 PM',
        title: 'Miramar Beach & Dona Paula Viewpoint',
        location: 'Dona Paula Jetty & Promenade',
        tag: 'Sightseeing',
        description: 'Admire the legendary lover’s rock overlooking where the Zuari and Mandovi rivers merge into the Arabian Sea.',
        cost: 0,
        duration: '1 hr 30m'
      },
      {
        id: 'act-3-5',
        time: '06:30 PM',
        title: 'Mandovi Sunset River Cruise with Goan Folk Dance',
        location: 'Santa Monica Jetty, Panaji',
        tag: 'Leisure',
        description: 'Glide along the Mandovi river on a two-deck cruise with live Dekhni and Fugdi folk dance performances and DJ music under the twilight sky.',
        cost: 650,
        duration: '1 hr 30m'
      }
    ]
  },
  {
    dayNumber: 4,
    date: '18 Oct',
    title: 'Day 4 — South Goa Serenity, Spices & Pristine Palolem',
    subtitle: 'Aromatic spice plantation tour, white sand coves, and dolphin spotting',
    activities: [
      {
        id: 'act-4-1',
        time: '08:30 AM',
        title: 'Scenic Drive to Sahakari Spice Plantation',
        location: 'Ponda, South Goa',
        tag: 'Sightseeing',
        description: 'Guided walking tour through lush spice groves of black pepper, cardamom, vanilla, and cinnamon. Concludes with a traditional buffet lunch served on banana leaves.',
        cost: 500,
        duration: '3 hours'
      },
      {
        id: 'act-4-2',
        time: '01:30 PM',
        title: 'Journey to Crescent-Shaped Palolem Beach',
        location: 'Canacona, South Goa',
        tag: 'Travel',
        description: 'Scenic highway drive down south lined with cashew plantations and coastal villages toward one of India’s most scenic beaches.',
        cost: 600,
        duration: '1 hr 15m'
      },
      {
        id: 'act-4-3',
        time: '03:15 PM',
        title: 'Sea Kayaking & Dolphin Spotting Boat Trip',
        location: 'Palolem & Butterfly Beach Cove',
        tag: 'Adventure',
        description: 'Paddle gentle turquoise waters in transparent kayaks or take a small traditional boat to spot wild dolphins leaping in secluded coves.',
        cost: 1200,
        duration: '2 hours'
      },
      {
        id: 'act-4-4',
        time: '06:00 PM',
        title: 'Silent Noise Headphone Beach Lounge / Shack Sunset',
        location: 'Neptune Point, Palolem',
        tag: 'Leisure',
        description: 'Unwind on beach recliners under fairy lights with fresh fruit smoothies and grilled tiger prawns.',
        cost: 850,
        duration: '2 hours'
      }
    ]
  },
  {
    dayNumber: 5,
    date: '19 Oct',
    title: 'Day 5 — Anjuna Flea Market, Souvenirs & Sunset Cliff Dinner',
    subtitle: 'Bohemian flea market, handmade cashew feni shopping, and iconic clifftop dinner',
    activities: [
      {
        id: 'act-5-1',
        time: '09:30 AM',
        title: 'Curated Shopping for Cashews, Spices & Feni',
        location: 'Mapusa Market & Goa Artisan Hub',
        tag: 'Sightseeing',
        description: 'Pick up GI-tagged Goan whole cashews, artisanal coconut feni, handmade ceramic azulejos tiles, and spiced sausages (Chouriço).',
        cost: 1500,
        duration: '2 hours'
      },
      {
        id: 'act-5-2',
        time: '12:30 PM',
        title: 'Lunch at Artjuna Garden Cafe',
        location: 'Anjuna Flea Market Road',
        tag: 'Food',
        description: 'Relish Mediterranean mezze platters, fresh mango smoothies, and artisanal sourdough in a lush mango-tree courtyard.',
        cost: 900,
        duration: '1 hr 30m'
      },
      {
        id: 'act-5-3',
        time: '03:00 PM',
        title: 'Chapora Fort (Dil Chahta Hai Point)',
        location: 'Chapora Hill, Vagator',
        tag: 'Historical',
        description: 'Hike up red laterite stone paths to the iconic clifftop fortress overlooking Vagator Beach and the Ozran coast.',
        cost: 0,
        duration: '2 hours'
      },
      {
        id: 'act-5-4',
        time: '06:00 PM',
        title: 'Farewell Sunset Dinner at Thalassa Clifftop',
        location: 'Siolim Clifftop, Vagator Overlook',
        tag: 'Food',
        description: 'Toast to an unforgettable holiday overlooking the sunset horizon with authentic Greek souvlaki, grilled fish, and live fire dancers.',
        cost: 2200,
        duration: '3 hours'
      }
    ]
  }
];

export const MOCK_ATTRACTIONS: Attraction[] = [
  {
    id: 'att-1',
    destination: 'Goa',
    name: 'Fort Aguada & Lighthouse',
    category: 'Historical',
    image: GOA_BEACH_IMAGE,
    description: 'A 17th-century Portuguese fortress located on Sinquerim Beach, featuring a freshwater spring and a grand 4-storey lighthouse with sweeping sea views.',
    entryFee: '₹50 per person',
    openingHours: '09:00 AM – 06:00 PM',
    bestTime: 'Morning or late afternoon (04:30 PM)',
    recommendedDuration: '1.5 – 2 Hours',
    highlights: ['Ancient freshwater reservoir', 'Ocean panoramic view', 'Portuguese ramparts', 'Photography spot']
  },
  {
    id: 'att-2',
    destination: 'Goa',
    name: 'Basilica of Bom Jesus',
    category: 'Historical',
    image: HYDERABAD_IMAGE,
    description: 'A UNESCO World Heritage monument and masterpiece of Baroque architecture. Contains the preserved body of St. Francis Xavier in a silver casket.',
    entryFee: 'Free entry',
    openingHours: '08:30 AM – 06:30 PM',
    bestTime: '10:00 AM – 12:00 PM',
    recommendedDuration: '1 – 1.5 Hours',
    highlights: ['UNESCO World Heritage', 'Baroque carved altars', 'Historical art museum', 'Se Cathedral nearby']
  },
  {
    id: 'att-3',
    destination: 'Goa',
    name: 'Palolem Beach & Butterfly Island',
    category: 'Beach',
    image: GOA_BEACH_IMAGE,
    description: 'A tranquil crescent-shaped beach fringed with coconut palms. Calm turquoise waters ideal for swimming, kayaking, and boat trips to Butterfly Beach.',
    entryFee: 'Free entry',
    openingHours: '24 Hours Open',
    bestTime: 'Early morning for kayaking / 05:00 PM for sunset',
    recommendedDuration: '3 – 4 Hours',
    highlights: ['Calm safe swimming waters', 'Sea kayaking to Secret Coves', 'Dolphin watching', 'Beach shacks']
  },
  {
    id: 'att-4',
    destination: 'Goa',
    name: 'Dudhsagar Waterfalls Trek & Jeep Safari',
    category: 'Adventure',
    image: KERALA_IMAGE,
    description: 'One of India’s tallest four-tiered waterfalls with cascades plunging 310 meters through dense Bhagwan Mahaveer Sanctuary jungles.',
    entryFee: '₹550 per person (Jeep Safari & Forest Permit)',
    openingHours: '06:00 AM – 04:00 PM',
    bestTime: 'Early morning departure from hotel',
    recommendedDuration: 'Full Day (5–6 Hours)',
    highlights: ['Jungle 4x4 Jeep Safari', 'Natural freshwater pool swim', 'Railway bridge photo op', 'Wildlife spotting']
  },
  {
    id: 'att-5',
    destination: 'Goa',
    name: 'Fontainhas Latin Quarter',
    category: 'Popular',
    image: HERO_IMAGE,
    description: 'Asia’s oldest surviving Latin Quarter in Panjim. Famous for vibrant yellow, green, and blue Portuguese villas, tiled roof terraces, and boutique art bakeries.',
    entryFee: 'Free walking neighborhood',
    openingHours: 'Best walked 08:00 AM – 07:00 PM',
    bestTime: '04:00 PM – 06:30 PM (Golden hour light)',
    recommendedDuration: '2 Hours',
    highlights: ['Azulejos tile art', 'Colonial architecture', 'Confeitaria 31 de Janeiro bakery', 'Art galleries']
  },
  {
    id: 'att-6',
    destination: 'Goa',
    name: 'Chorao Island & Salim Ali Bird Sanctuary',
    category: 'Hidden Gem',
    image: KERALA_IMAGE,
    description: 'A serene mangrove island reachable by an idyllic vehicle ferry from Ribandar. Home to migratory kingfishers, eagles, and quiet village trails.',
    entryFee: '₹20 (Ferry is free for foot passengers)',
    openingHours: '06:00 AM – 06:00 PM',
    bestTime: '06:30 AM – 09:00 AM for bird watching',
    recommendedDuration: '2.5 Hours',
    highlights: ['Mangrove canoe ride', 'Rare avian species', 'Untouched Goan village life', 'Free scenic ferry']
  },
  {
    id: 'att-7',
    destination: 'Goa',
    name: 'Baga & Calangute Water Sports Hub',
    category: 'Adventure',
    image: HERO_IMAGE,
    description: 'The epicenter of coastal thrill in North Goa. Certified operators offer tandem parasailing, jet skiing, bumper rides, and speed boating.',
    entryFee: 'Activities from ₹400 – ₹1,800',
    openingHours: '09:00 AM – 05:30 PM (Weather permitting)',
    bestTime: '10:00 AM – 01:00 PM',
    recommendedDuration: '2 Hours',
    highlights: ['Parasailing over open sea', 'High-speed jet ski', 'Banana boat group ride', 'Certified life vests']
  },
  {
    id: 'att-8',
    destination: 'Goa',
    name: 'Cabo de Rama Fort & Cliff Overlook',
    category: 'Hidden Gem',
    image: GOA_BEACH_IMAGE,
    description: 'A wild, remote fortress perched high upon dramatic sea cliffs in Canacona. Legend says Lord Rama and Sita stayed here during their exile.',
    entryFee: 'Free entry',
    openingHours: '09:00 AM – 05:30 PM',
    bestTime: '04:30 PM – Sunset',
    recommendedDuration: '2 Hours',
    highlights: ['Dramatic cliff drops', 'Ancient cannon battery', 'Uncrowded panoramic lookout', 'Pebble beach below']
  }
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rst-1',
    destination: 'Goa',
    name: "Fisherman's Wharf",
    cuisine: 'Authentic Goan & Fresh Seafood',
    priceRange: '₹₹₹',
    rating: 4.8,
    reviewsCount: 3200,
    specialty: 'Goan Prawn Balchão, Kingfish Peri-Peri & Crab in Butter Garlic Sauce',
    location: 'Cavelossim (South) & Calangute (North)',
    mustTry: ['Kingfish Rava Fry', 'Prawn Xec Xec', 'Bebinca with Vanilla Gelato', 'Kokum Mojito'],
    timing: '12:00 PM – 11:30 PM'
  },
  {
    id: 'rst-2',
    destination: 'Goa',
    name: 'Viva Panjim Heritage Eatery',
    cuisine: 'Traditional Portuguese-Goan Home Cooking',
    priceRange: '₹₹',
    rating: 4.7,
    reviewsCount: 1850,
    specialty: 'Pork Vindaloo, Mushroom Cafreal, Goan Fish Curry Thali',
    location: 'Fontainhas Latin Quarter, Panaji',
    mustTry: ['Goan Fish Thali', 'Chicken Cafreal with Poi', 'Serradura Cream Dessert'],
    timing: '12:30 PM – 03:30 PM & 07:00 PM – 10:30 PM'
  },
  {
    id: 'rst-3',
    destination: 'Goa',
    name: 'Artjuna Garden Cafe & Lifestyle Hub',
    cuisine: 'Mediterranean, Healthy Bowls & Artisanal Bakery',
    priceRange: '₹₹',
    rating: 4.6,
    reviewsCount: 2400,
    specialty: 'Falafel Mezze Platter, Shakshuka, Organic Coffee & Smoothies',
    location: 'Anjuna Beach Road',
    mustTry: ['Artjuna Mezze Deluxe', 'Avocado Sourdough Toast', 'Raw Mango Kombucha'],
    timing: '08:00 AM – 10:30 PM'
  },
  {
    id: 'rst-4',
    destination: 'Goa',
    name: 'Thalassa Sunset Clifftop',
    cuisine: 'Greek Tavern & Mediterranean Seafood',
    priceRange: '₹₹₹₹',
    rating: 4.9,
    reviewsCount: 4500,
    specialty: 'Souvlaki Skewers, Steamed Mussels in White Wine, Clifftop Cocktails',
    location: 'Siolim Waterfront & Vagator Overlook',
    mustTry: ['Greek Prawn Souvlaki', 'Spanakopita Spinach Pie', 'Sunset Sangria Jug'],
    timing: '09:00 AM – 01:00 AM'
  }
];

export const MOCK_LOCAL_TRANSPORT: LocalTransportOption[] = [
  {
    id: 'lt-1',
    vehicle: 'Self-Drive Honda Activa / Scooty',
    priceEstimate: '₹350 – ₹450 / day',
    type: 'Best for North & South Beach Hopping',
    pros: 'Maximum freedom, easy parking at packed beach lanes, very economical.',
    bookingTip: 'Carry valid original Driving License; helmets are strictly enforced on highways.'
  },
  {
    id: 'lt-2',
    vehicle: 'Royal Enfield Classic 350 / Himalayan',
    priceEstimate: '₹800 – ₹1,200 / day',
    type: 'Great for Scenic Coastal & Ghat Drives',
    pros: 'Comfortable ride for long coastal stretches down south to Palolem or Dudhsagar.',
    bookingTip: 'Inspect tyre pressure and fuel level upon collection; deposit ₹1,000 to ₹2,000 usually required.'
  },
  {
    id: 'lt-3',
    vehicle: 'GoaMiles App Taxi / Prepaid Airport Cabs',
    priceEstimate: '₹1,200 – ₹1,800 per inter-city trip',
    type: 'Official App-based Taxi Service',
    pros: 'Fixed government-metered fares, air-conditioned comfort, luggage capacity.',
    bookingTip: 'Download GoaMiles app before landing or use the prepaid counter directly at Mopa (GOX) / Dabolim (GOI).'
  },
  {
    id: 'lt-4',
    vehicle: 'Kadamba Electric AC Luxury Shuttles',
    priceEstimate: '₹150 – ₹250 per passenger',
    type: 'Airport to City/Beach Connection',
    pros: 'Clean, green electric buses running regularly from Mopa and Dabolim to Panjim, Calangute, and Margao.',
    bookingTip: 'Tickets can be booked on spot or via online transit portal.'
  },
  {
    id: 'lt-5',
    vehicle: 'River Passenger & Vehicle Ferries',
    priceEstimate: 'Free for Foot Passengers / ₹10 for Scooters',
    type: 'Scenic Water Crossings',
    pros: 'Avoids long highway loops across Mandovi and Zuari rivers; authentic local experience.',
    bookingTip: 'Operates every 15–30 minutes between Panaji-Betim and Ribandar-Chorao.'
  }
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'chk-1', category: 'Documents', item: 'Government ID Cards (Aadhaar / Passport / Voter ID)', completed: true },
  { id: 'chk-2', category: 'Documents', item: 'Flight / Train E-Tickets & Boarding Passes', completed: true },
  { id: 'chk-3', category: 'Documents', item: 'Hotel Booking Confirmation Voucher', completed: true },
  { id: 'chk-4', category: 'Documents', item: 'Original Driving License (for scooter / car self-drive)', completed: false },
  { id: 'chk-5', category: 'Clothing', item: 'Breathable Cotton / Linen Clothes & Casual Tees', completed: true },
  { id: 'chk-6', category: 'Clothing', item: 'Swimwear / Beach Shorts & Cover-ups', completed: false },
  { id: 'chk-7', category: 'Clothing', item: 'UV Sunglasses & Wide-Brim Sun Hat', completed: false },
  { id: 'chk-8', category: 'Clothing', item: 'Comfortable Walking Sandals & Water Shoes', completed: false },
  { id: 'chk-9', category: 'Electronics', item: 'Fast Phone Chargers & 20,000mAh Power Bank', completed: true },
  { id: 'chk-10', category: 'Electronics', item: 'Waterproof Phone Pouch for Beach & Watersports', completed: false },
  { id: 'chk-11', category: 'Health & Toiletries', item: 'Water-resistant Sunscreen Lotion (SPF 50+ PA+++)', completed: false },
  { id: 'chk-12', category: 'Health & Toiletries', item: 'Mosquito Repellent Cream (Odomos) & First Aid basics', completed: false },
  { id: 'chk-13', category: 'Cash & Cards', item: 'Active UPI with linked bank account for instant QR payments', completed: true },
  { id: 'chk-14', category: 'Cash & Cards', item: '₹3,000 to ₹5,000 Cash (Handy for small beach shacks and parking)', completed: false }
];

export const EMERGENCY_CONTACTS = [
  { name: 'National Emergency Response System', number: '112', desc: 'Police, Fire & Medical all-in-one emergency' },
  { name: 'Goa Tourist Police Special Wing', number: '+91 832 2410035', desc: 'Dedicated 24/7 tourist assistance & safety' },
  { name: 'Ambulance & Emergency Medical Service', number: '108', desc: 'Trained paramedics & instant dispatch' },
  { name: 'Goa Medical College Hospital (GMC)', number: '+91 832 2458725', desc: 'Premier tertiary care hospital in Bambolim, Panaji' },
  { name: 'Manipal Hospital Dona Paula', number: '+91 832 2453000', desc: '24/7 multi-specialty private hospital' },
  { name: 'Women Safety Helpline', number: '1091', desc: 'Confidential toll-free assistance' },
  { name: 'Railway / Station Inquiry Helpline', number: '139', desc: 'PNR, coach location & live train status' },
  { name: 'Goa Airport Helpdesk (GOX / GOI)', number: '+91 832 2540802', desc: 'Flight status, lost baggage & assistance' }
];
