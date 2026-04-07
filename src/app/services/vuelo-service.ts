// services/vuelo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vuelo } from '../models/vuelo.model';
import {environment } from '../environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class VueloService {

  private apiUrl = `${environment.apiBaseUrl}/vuelos`;

  constructor(private http: HttpClient) {}

  buscarVuelos(origenId: number, destinoId: number, fechaViaje: string): Observable<Vuelo[]> {
    let params = new HttpParams()
      .set('origenId', origenId.toString())
      .set('destinoId', destinoId.toString())
      .set('fechaViaje', fechaViaje);

    return this.http.get<Vuelo[]>(`${this.apiUrl}/buscar`, { params })
      .pipe(catchError(this.manejarError));
  }

  private manejarError(error: any) {
    return throwError(() => new Error('Hubo un error en la solicitud. Intente de nuevo más tarde.'));
  }
}
