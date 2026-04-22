import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoogleFlight, GoogleFlightsResponse, BookingOptionDetail, BookingOptionsResponse, BookingRequest } from '../models/google-flight.model';
import { environment } from '../environment/enviroment';

export interface GoogleFlightsResult {
  vuelos: GoogleFlight[];
  googleFlightsUrl: string;
}

export interface BookingResult {
  opciones: BookingOptionDetail[];
  googleFlightsUrl: string;
}

@Injectable({ providedIn: 'root' })
export class GoogleFlightsService {

  private proxyUrl = '/serpapi/search';

  constructor(private http: HttpClient) {}

  buscarVuelos(departureId: string, arrivalId: string, outboundDate: string): Observable<GoogleFlightsResult> {
    const params = new HttpParams()
      .set('engine', 'google_flights')
      .set('departure_id', departureId)
      .set('arrival_id', arrivalId)
      .set('outbound_date', outboundDate)
      .set('type', '2')
      .set('currency', 'COP')
      .set('hl', 'es')
      .set('gl', 'co')
      .set('api_key', environment.serpApiKey);

    return this.http.get<GoogleFlightsResponse>(this.proxyUrl, { params }).pipe(
      map((res) => {
        if (res.error) throw new Error(res.error);
        const vuelos = [...(res.best_flights ?? []), ...(res.other_flights ?? [])];
        const googleFlightsUrl = res.search_metadata?.google_flights_url ?? '';
        return { vuelos, googleFlightsUrl };
      }),
      catchError((err) => throwError(() => new Error(err.message ?? 'Error al consultar Google Flights')))
    );
  }

  obtenerOpcionesCompra(
    booking_token: string,
    departure_id: string,
    arrival_id: string,
    outbound_date: string
  ): Observable<BookingResult> {
    const params = new HttpParams()
      .set('engine', 'google_flights')
      .set('type', '2')
      .set('booking_token', booking_token)
      .set('departure_id', departure_id)
      .set('arrival_id', arrival_id)
      .set('outbound_date', outbound_date)
      .set('currency', 'COP')
      .set('hl', 'es')
      .set('gl', 'co')
      .set('api_key', environment.serpApiKey);

    return this.http.get<BookingOptionsResponse>(this.proxyUrl, { params }).pipe(
      map((res) => {
        if (res.error) throw new Error(res.error);
        const opciones: BookingOptionDetail[] = [];
        for (const opt of (res.booking_options ?? [])) {
          if (opt.together) opciones.push(opt.together);
          if (opt.separate) opciones.push(...opt.separate);
        }
        // La URL de google_flights_url del response de booking tiene el vuelo preseleccionado
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
