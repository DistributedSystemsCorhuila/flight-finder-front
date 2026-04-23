import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Aeropuerto } from '../models/aeropuerto.model';

const AEROPUERTOS_MUNDO: Aeropuerto[] = [
  // ── COLOMBIA ──────────────────────────────────────────────
  { id: 1,  codigo: 'BOG', nombre: 'El Dorado Internacional',          ciudad: 'Bogotá',        pais: 'CO' },
  { id: 2,  codigo: 'MDE', nombre: 'José María Córdova',               ciudad: 'Medellín',      pais: 'CO' },
  { id: 3,  codigo: 'CLO', nombre: 'Alfonso Bonilla Aragón',           ciudad: 'Cali',          pais: 'CO' },
  { id: 4,  codigo: 'BAQ', nombre: 'Ernesto Cortissoz',                ciudad: 'Barranquilla',  pais: 'CO' },
  { id: 5,  codigo: 'CTG', nombre: 'Rafael Núñez',                     ciudad: 'Cartagena',     pais: 'CO' },
  { id: 6,  codigo: 'BGA', nombre: 'Palonegro',                        ciudad: 'Bucaramanga',   pais: 'CO' },
  { id: 7,  codigo: 'SMR', nombre: 'Simón Bolívar',                    ciudad: 'Santa Marta',   pais: 'CO' },
  { id: 8,  codigo: 'PEI', nombre: 'Matecaña',                         ciudad: 'Pereira',       pais: 'CO' },
  { id: 9,  codigo: 'ADZ', nombre: 'Gustavo Rojas Pinilla',            ciudad: 'San Andrés',    pais: 'CO' },
  { id: 10, codigo: 'CUC', nombre: 'Camilo Daza',                      ciudad: 'Cúcuta',        pais: 'CO' },
  { id: 11, codigo: 'EOH', nombre: 'Olaya Herrera',                    ciudad: 'Medellín',      pais: 'CO' },
  { id: 12, codigo: 'MVR', nombre: 'La Florida',                       ciudad: 'Villavicencio', pais: 'CO' },
  { id: 13, codigo: 'PSO', nombre: 'Antonio Nariño',                   ciudad: 'Pasto',         pais: 'CO' },
  { id: 14, codigo: 'TCO', nombre: 'La Florida (Tumaco)',               ciudad: 'Tumaco',        pais: 'CO' },
  { id: 15, codigo: 'AXM', nombre: 'El Edén',                          ciudad: 'Armenia',       pais: 'CO' },
  { id: 16, codigo: 'MTR', nombre: 'Los Garzones',                     ciudad: 'Montería',      pais: 'CO' },
  { id: 17, codigo: 'UIB', nombre: 'El Caraño',                        ciudad: 'Quibdó',        pais: 'CO' },
  { id: 18, codigo: 'RCH', nombre: 'Almirante Padilla',                ciudad: 'Riohacha',      pais: 'CO' },
  { id: 19, codigo: 'SJE', nombre: 'Jorge E. González Torres',         ciudad: 'San José Guaviare', pais: 'CO' },
  { id: 20, codigo: 'LET', nombre: 'Alfredo Vásquez Cobo',             ciudad: 'Leticia',       pais: 'CO' },
  // ── LATINOAMÉRICA ─────────────────────────────────────────
  { id: 21, codigo: 'GRU', nombre: 'Guarulhos Internacional',          ciudad: 'São Paulo',     pais: 'BR' },
  { id: 22, codigo: 'GIG', nombre: 'Galeão Internacional',             ciudad: 'Río de Janeiro',pais: 'BR' },
  { id: 23, codigo: 'EZE', nombre: 'Ministro Pistarini',               ciudad: 'Buenos Aires',  pais: 'AR' },
  { id: 24, codigo: 'SCL', nombre: 'Arturo Merino Benítez',            ciudad: 'Santiago',      pais: 'CL' },
  { id: 25, codigo: 'LIM', nombre: 'Jorge Chávez',                     ciudad: 'Lima',          pais: 'PE' },
  { id: 26, codigo: 'UIO', nombre: 'Mariscal Sucre',                   ciudad: 'Quito',         pais: 'EC' },
  { id: 27, codigo: 'GYE', nombre: 'José Joaquín de Olmedo',           ciudad: 'Guayaquil',     pais: 'EC' },
  { id: 28, codigo: 'CCS', nombre: 'Simón Bolívar',                    ciudad: 'Caracas',       pais: 'VE' },
  { id: 29, codigo: 'MVD', nombre: 'Carrasco Internacional',           ciudad: 'Montevideo',    pais: 'UY' },
  { id: 30, codigo: 'ASU', nombre: 'Silvio Pettirossi',                ciudad: 'Asunción',      pais: 'PY' },
  { id: 31, codigo: 'VVI', nombre: 'Viru Viru',                        ciudad: 'Santa Cruz',    pais: 'BO' },
  { id: 32, codigo: 'MEX', nombre: 'Benito Juárez Internacional',      ciudad: 'Ciudad de México', pais: 'MX' },
  { id: 33, codigo: 'CUN', nombre: 'Cancún Internacional',             ciudad: 'Cancún',        pais: 'MX' },
  { id: 34, codigo: 'PTY', nombre: 'Tocumen Internacional',            ciudad: 'Panamá',        pais: 'PA' },
  { id: 35, codigo: 'SJO', nombre: 'Juan Santamaría',                  ciudad: 'San José',      pais: 'CR' },
  { id: 36, codigo: 'HAV', nombre: 'José Martí',                       ciudad: 'La Habana',     pais: 'CU' },
  { id: 37, codigo: 'SDQ', nombre: 'Las Américas',                     ciudad: 'Santo Domingo', pais: 'DO' },
  { id: 38, codigo: 'MIA', nombre: 'Miami Internacional',              ciudad: 'Miami',         pais: 'US' },
  // ── NORTE AMÉRICA ─────────────────────────────────────────
  { id: 39, codigo: 'JFK', nombre: 'John F. Kennedy',                  ciudad: 'Nueva York',    pais: 'US' },
  { id: 40, codigo: 'LAX', nombre: 'Los Ángeles Internacional',        ciudad: 'Los Ángeles',   pais: 'US' },
  { id: 41, codigo: 'ORD', nombre: "O'Hare Internacional",             ciudad: 'Chicago',       pais: 'US' },
  { id: 42, codigo: 'ATL', nombre: 'Hartsfield-Jackson',               ciudad: 'Atlanta',       pais: 'US' },
  { id: 43, codigo: 'DFW', nombre: 'Dallas/Fort Worth',                ciudad: 'Dallas',        pais: 'US' },
  { id: 44, codigo: 'DEN', nombre: 'Denver Internacional',             ciudad: 'Denver',        pais: 'US' },
  { id: 45, codigo: 'SFO', nombre: 'San Francisco Internacional',      ciudad: 'San Francisco', pais: 'US' },
  { id: 46, codigo: 'LAS', nombre: 'Harry Reid Internacional',         ciudad: 'Las Vegas',     pais: 'US' },
  { id: 47, codigo: 'SEA', nombre: 'Seattle-Tacoma',                   ciudad: 'Seattle',       pais: 'US' },
  { id: 48, codigo: 'IAH', nombre: 'George Bush Intercontinental',     ciudad: 'Houston',       pais: 'US' },
  { id: 49, codigo: 'YYZ', nombre: 'Toronto Pearson',                  ciudad: 'Toronto',       pais: 'CA' },
  { id: 50, codigo: 'YVR', nombre: 'Vancouver Internacional',          ciudad: 'Vancouver',     pais: 'CA' },
  { id: 51, codigo: 'YUL', nombre: 'Montréal-Trudeau',                 ciudad: 'Montreal',      pais: 'CA' },
  // ── EUROPA ────────────────────────────────────────────────
  { id: 52, codigo: 'LHR', nombre: 'London Heathrow',                  ciudad: 'Londres',       pais: 'GB' },
  { id: 53, codigo: 'CDG', nombre: 'Charles de Gaulle',                ciudad: 'París',         pais: 'FR' },
  { id: 54, codigo: 'FRA', nombre: 'Frankfurt am Main',                ciudad: 'Frankfurt',     pais: 'DE' },
  { id: 55, codigo: 'AMS', nombre: 'Amsterdam Schiphol',               ciudad: 'Ámsterdam',     pais: 'NL' },
  { id: 56, codigo: 'MAD', nombre: 'Adolfo Suárez Madrid-Barajas',     ciudad: 'Madrid',        pais: 'ES' },
  { id: 57, codigo: 'BCN', nombre: 'El Prat',                          ciudad: 'Barcelona',     pais: 'ES' },
  { id: 58, codigo: 'FCO', nombre: 'Leonardo da Vinci (Fiumicino)',     ciudad: 'Roma',          pais: 'IT' },
  { id: 59, codigo: 'MUC', nombre: 'Munich Internacional',             ciudad: 'Múnich',        pais: 'DE' },
  { id: 60, codigo: 'IST', nombre: 'Estambul',                         ciudad: 'Estambul',      pais: 'TR' },
  { id: 61, codigo: 'ZUR', nombre: 'Zúrich',                           ciudad: 'Zúrich',        pais: 'CH' },
  { id: 62, codigo: 'BRU', nombre: 'Brussels Airlines',                ciudad: 'Bruselas',      pais: 'BE' },
  { id: 63, codigo: 'VIE', nombre: 'Viena Schwechat',                  ciudad: 'Viena',         pais: 'AT' },
  { id: 64, codigo: 'LIS', nombre: 'Humberto Delgado',                 ciudad: 'Lisboa',        pais: 'PT' },
  { id: 65, codigo: 'CPH', nombre: 'Copenhague',                       ciudad: 'Copenhague',    pais: 'DK' },
  { id: 66, codigo: 'ARN', nombre: 'Stockholm Arlanda',                ciudad: 'Estocolmo',     pais: 'SE' },
  // ── ASIA / OCEANÍA ────────────────────────────────────────
  { id: 67, codigo: 'DXB', nombre: 'Dubai Internacional',              ciudad: 'Dubái',         pais: 'AE' },
  { id: 68, codigo: 'SIN', nombre: 'Changi',                           ciudad: 'Singapur',      pais: 'SG' },
  { id: 69, codigo: 'NRT', nombre: 'Narita',                           ciudad: 'Tokio',         pais: 'JP' },
  { id: 70, codigo: 'HND', nombre: 'Haneda',                           ciudad: 'Tokio',         pais: 'JP' },
  { id: 71, codigo: 'PEK', nombre: 'Capital de Pekín',                 ciudad: 'Pekín',         pais: 'CN' },
  { id: 72, codigo: 'PVG', nombre: 'Pudong',                           ciudad: 'Shanghái',      pais: 'CN' },
  { id: 73, codigo: 'HKG', nombre: 'Hong Kong Internacional',          ciudad: 'Hong Kong',     pais: 'HK' },
  { id: 74, codigo: 'ICN', nombre: 'Incheon',                          ciudad: 'Seúl',          pais: 'KR' },
  { id: 75, codigo: 'BKK', nombre: 'Suvarnabhumi',                     ciudad: 'Bangkok',       pais: 'TH' },
  { id: 76, codigo: 'KUL', nombre: 'Kuala Lumpur Internacional',       ciudad: 'Kuala Lumpur',  pais: 'MY' },
  { id: 77, codigo: 'SYD', nombre: 'Kingsford Smith',                  ciudad: 'Sídney',        pais: 'AU' },
  { id: 78, codigo: 'MEL', nombre: 'Melbourne',                        ciudad: 'Melbourne',     pais: 'AU' },
  { id: 79, codigo: 'DEL', nombre: 'Indira Gandhi',                    ciudad: 'Nueva Delhi',   pais: 'IN' },
  { id: 80, codigo: 'BOM', nombre: 'Chhatrapati Shivaji',              ciudad: 'Bombay',        pais: 'IN' },
  // ── AFRICA / ORIENTE MEDIO ────────────────────────────────
  { id: 81, codigo: 'JNB', nombre: 'O.R. Tambo',                       ciudad: 'Johannesburgo', pais: 'ZA' },
  { id: 82, codigo: 'CAI', nombre: 'El Cairo',                         ciudad: 'El Cairo',      pais: 'EG' },
  { id: 83, codigo: 'ADD', nombre: 'Bole',                             ciudad: 'Addis Abeba',   pais: 'ET' },
  { id: 84, codigo: 'NBO', nombre: 'Jomo Kenyatta',                    ciudad: 'Nairobi',       pais: 'KE' },
  { id: 85, codigo: 'CMN', nombre: 'Mohammed V',                       ciudad: 'Casablanca',    pais: 'MA' },
  { id: 86, codigo: 'DOH', nombre: 'Hamad Internacional',              ciudad: 'Doha',          pais: 'QA' },
  { id: 87, codigo: 'AUH', nombre: 'Abu Dhabi Internacional',          ciudad: 'Abu Dhabi',     pais: 'AE' },
];

@Injectable({
  providedIn: 'root'
})
export class AeropuertoService {

  /** Devuelve todos los aeropuertos hardcodeados */
  obtenerAeropuertos(): Observable<Aeropuerto[]> {
    return of(AEROPUERTOS_MUNDO);
  }

  /**
   * Filtra la lista local por código IATA, nombre o ciudad.
   * No realiza ninguna llamada HTTP.
   */
  buscarAeropuertos(query: string): Observable<Aeropuerto[]> {
    const q = (query || '').trim().toLowerCase();
    if (q.length < 1) return of(AEROPUERTOS_MUNDO);

    const resultado = AEROPUERTOS_MUNDO.filter(a =>
      a.codigo.toLowerCase().includes(q) ||
      a.nombre.toLowerCase().includes(q) ||
      a.ciudad.toLowerCase().includes(q) ||
      a.pais.toLowerCase().includes(q)
    );
    return of(resultado);
  }
}
