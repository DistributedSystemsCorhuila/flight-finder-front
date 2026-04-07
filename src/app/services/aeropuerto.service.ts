import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aeropuerto } from '../models/aeropuerto.model';
import { environment } from '../environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AeropuertoService {
  private apiUrl = `${environment.apiBaseUrl}/aeropuertos`;

  constructor(private http: HttpClient) {}

  obtenerAeropuertos(): Observable<Aeropuerto[]> {
    return this.http.get<Aeropuerto[]>(`${this.apiUrl}/todos`);
  }

}
