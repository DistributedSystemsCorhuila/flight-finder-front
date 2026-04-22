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
