import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BusquedaHistorica } from '../models/busqueda-historica.model';
import { environment } from '../environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class BusquedaHistoricaService {
  private apiUrl = `${environment.apiBaseUrl}/flights/search-history`;

  constructor(private http: HttpClient) {}

  // Guardar una búsqueda de vuelos
  guardarBusqueda(datos: any): Observable<BusquedaHistorica> {
    return this.http.post<BusquedaHistorica>(this.apiUrl, datos)
      .pipe(catchError(this.manejarError));
  }

  // Obtener el histórico de búsquedas por usuario
  obtenerHistoricoPorUsuario(username: string): Observable<BusquedaHistorica[]> {
    return this.http.get<BusquedaHistorica[]>(`${this.apiUrl}/${username}`)
      .pipe(catchError(this.manejarError));
  }

  private manejarError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError(() => new Error('Hubo un error en la solicitud. Intente de nuevo más tarde.'));
  }
}

