import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoogleFlight, GoogleFlightsResponse, BookingOptionDetail, BookingOptionsResponse, BookingRequest, BackendFlight, FlightSegment } from '../models/google-flight.model';
import { environment } from '../environment/enviroment';

export interface GoogleFlightsResult {
  vuelos: any[];
  googleFlightsUrl: string;
}

export interface BookingResult {
  opciones: BookingOptionDetail[];
  googleFlightsUrl: string;
}

@Injectable({ providedIn: 'root' })
export class GoogleFlightsService {

  private apiUrl = `${environment.apiBaseUrl}/flights`;

  constructor(private http: HttpClient) {}

  buscarVuelos(departureId: string, arrivalId: string, outboundDate: string, returnDate?: string): Observable<GoogleFlightsResult> {
    const params = new HttpParams()
      .set('origin', departureId)
      .set('destination', arrivalId)
      .set('departureDate', outboundDate)
      .set('adults', '1');

    // Si hay fecha de retorno, la agregamos al parámetro
    const finalParams = returnDate && returnDate.trim()
      ? params.set('returnDate', returnDate)
      : params;

    return this.http.get<any[]>(`${this.apiUrl}/search`, { params: finalParams }).pipe(
      map((vuelos) => {
        // Mapear respuesta del backend a formato esperado
        const vuelosMapeados = (vuelos || []).map(v => this.mapBackendFlightToGoogleFlight(v));
        return {
          vuelos: vuelosMapeados,
          googleFlightsUrl: ''
        };
      }),
      catchError((err) => throwError(() => new Error(err.message ?? 'Error al consultar vuelos')))
    );
  }

  /**
   * Mapea respuesta del backend (con segments) a formato GoogleFlight
   */
  private mapBackendFlightToGoogleFlight(backendFlight: BackendFlight | any): GoogleFlight | BackendFlight {
    // Si ya tiene la estructura de GoogleFlight, devolverlo como está
    if (backendFlight.flights) {
      return backendFlight as GoogleFlight;
    }

    // Si tiene segments, mapear a GoogleFlight
    if (backendFlight.segments && Array.isArray(backendFlight.segments)) {
      const segments = backendFlight.segments as FlightSegment[];
      const flights = segments.map(seg => ({
        departure_airport: {
          name: seg.departureAirportName,
          id: seg.departureAirportCode,
          time: new Date(seg.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        },
        arrival_airport: {
          name: seg.arrivalAirportName,
          id: seg.arrivalAirportCode,
          time: new Date(seg.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        },
        duration: seg.duration,
        airplane: seg.airplane,
        airline: seg.airline,
        airline_logo: seg.airlineLogo || '', // Mapear airlineLogo del backend
        travel_class: seg.travelClass,
        flight_number: seg.flightNumber,
        legroom: ''
      }));

      return {
        flights: flights,
        layovers: backendFlight.layovers || [],
        total_duration: backendFlight.totalDuration,
        price: backendFlight.price,
        currency: backendFlight.currency,
        type: backendFlight.tripType,
        airline_logo: flights[0]?.airline_logo || backendFlight.airlineLogo || '', // Usar del primer vuelo o del backend
        booking_token: backendFlight.bookingToken,
        carbon_emissions: {
          this_flight: backendFlight.carbonEmission,
          typical_for_this_route: 0,
          difference_percent: 0
        }
      } as GoogleFlight;
    }

    // Si no tiene ni flights ni segments, devolver tal cual
    return backendFlight;
  }


  obtenerOpcionesCompra(
    booking_token: string,
    departure_id: string,
    arrival_id: string,
    outbound_date: string,
    return_date?: string
  ): Observable<BookingResult> {
    const params = new HttpParams()
      .set('booking_token', booking_token)
      .set('departure_id', departure_id)
      .set('arrival_id', arrival_id)
      .set('outbound_date', outbound_date);

    // Si hay fecha de retorno, la agregamos al parámetro
    const finalParams = return_date && return_date.trim()
      ? params.set('return_date', return_date)
      : params;

    return this.http.get<BookingOptionsResponse>(`${this.apiUrl}/booking-options`, { params: finalParams }).pipe(
      map((res) => {
        if (res.error) throw new Error(res.error);
        const opciones: BookingOptionDetail[] = [];
        for (const opt of (res.booking_options ?? [])) {
          if (opt.together) opciones.push(opt.together);
          if (opt.separate) opciones.push(...opt.separate);
        }
        const googleFlightsUrl = res.search_metadata?.google_flights_url ?? '';
        return { opciones, googleFlightsUrl };
      }),
      catchError((err) => throwError(() => new Error(err.message ?? 'Error al obtener opciones de compra')))
    );
  }

  abrirReserva(bookingRequest: BookingRequest): void {
    if (bookingRequest && bookingRequest.url) {
      if (bookingRequest.post_data) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = bookingRequest.url;
        form.target = '_blank';

        const dataPairs = bookingRequest.post_data.split('&');
        for (const pair of dataPairs) {
          const splitIdx = pair.indexOf('=');
          if (splitIdx !== -1) {
            const key = pair.substring(0, splitIdx);
            const value = pair.substring(splitIdx + 1);
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = decodeURIComponent(key);
            input.value = decodeURIComponent(value);
            form.appendChild(input);
          }
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      } else {
        window.open(bookingRequest.url, '_blank');
      }
    }
  }
}
