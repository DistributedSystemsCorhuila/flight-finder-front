export interface BusquedaHistorica {
  id: number;
  username: string;
  engine: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  type: number;
  adults: number;
  currency: string;
  language: string;
  country: string;
  cabin_class: string;
  searched_at: string;
}

