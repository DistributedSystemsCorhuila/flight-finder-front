export interface GoogleFlightLeg {
  departure_airport: { name: string; id: string; time: string; };
  arrival_airport:   { name: string; id: string; time: string; };
  duration: number;
  airplane: string;
  airline: string;
  airline_logo: string;
  travel_class: string;
  flight_number: string;
  legroom: string;
  extensions?: string[];
}

// New model to support backend API response with segments
export interface FlightSegment {
  id?: number | null;
  segmentOrder: number;
  flightNumber: string;
  airline: string;
  airlineLogo?: string;
  airplane: string;
  travelClass: string;
  departureAirportCode: string;
  departureAirportName: string;
  arrivalAirportCode: string;
  arrivalAirportName: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  delayed: boolean;
}

export interface FlightLayover {
  id?: number | null;
  duration: number;
  airportCode: string;
  airportName: string;
}

// New model to support backend API response
export interface BackendFlight {
  id?: number | null;
  totalDuration: number;
  totalStops: number;
  price: number;
  currency: string;
  tripType: string;
  carbonEmission: number;
  bookingToken: string;
  airlineLogo?: string;
  segments: FlightSegment[];
  layovers: FlightLayover[];
}

export interface BookingRequest {
  url: string;
  post_data: string;
}

export interface BookingOptionDetail {
  book_with: string;
  airline?: boolean;
  airline_logos?: string[];
  marketed_as?: string[];
  price: number;
  booking_request: BookingRequest;
}

export interface BookingOption {
  together?: BookingOptionDetail;
  separate?: BookingOptionDetail[];
}

export interface BookingOptionsResponse {
  booking_options?: BookingOption[];
  error?: string;
  search_metadata?: {
    status: string;
    google_flights_url?: string;
  };
}

export interface GoogleFlight {
  flights: GoogleFlightLeg[];
  layovers?: {
    duration: number;
    name: string;
    id: string;
  }[];
  total_duration: number;  // minutes
  carbon_emissions?: {
    this_flight: number;
    typical_for_this_route: number;
    difference_percent: number;
  };
  price: number;
  currency?: string;
  type: string;
  airline_logo: string;
  departure_token?: string;
  booking_token?: string;
}

export interface GoogleFlightsResponse {
  best_flights?: GoogleFlight[];
  other_flights?: GoogleFlight[];
  search_metadata?: {
    status: string;
    google_flights_url?: string;
  };
  error?: string;
}
