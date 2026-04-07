import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioRegistro } from '../models/usuario-registro.model';
import { UsuarioLogin } from '../models/usuario-login.model';
import { environment } from '../environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiBaseUrl}/users`;
  constructor(private http: HttpClient) {}

  iniciarSesion(loginData: UsuarioLogin): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }
  

  registrarUsuario(usuario: UsuarioRegistro): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, usuario);
  }
}
