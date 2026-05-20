import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vuelo } from '../../models/vuelo.model';
import { Aeropuerto } from '../../models/aeropuerto.model';
import { GoogleFlight, GoogleFlightLeg, BookingOptionDetail } from '../../models/google-flight.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AeropuertoService } from '../../services/aeropuerto.service';
import { VueloService } from '../../services/vuelo-service';
import { GoogleFlightsService, GoogleFlightsResult, BookingResult } from '../../services/google-flights.service';
import { BusquedaHistoricaService } from '../../services/busqueda-historica.service';
import { NavbarComponent } from '../navbar/navbar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-busqueda-vuelos',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './busqueda-vuelos.component.html',
  styleUrls: ['./busqueda-vuelos.component.css']
})
export class BusquedaVuelosComponent implements OnInit {

  fechaViaje: string = '';
  vuelos: Vuelo[] = [];
  buscado: boolean = false;

  // Aeropuertos
  aeropuertos: Aeropuerto[] = [];
  aeropuertosFiltradosOrigen: Aeropuerto[] = [];
  aeropuertosFiltradosDestino: Aeropuerto[] = [];
  cargandoAeropuertos: boolean = false;
  cargandoBusquedaOrigen: boolean = false;
  cargandoBusquedaDestino: boolean = false;

  // Selección
  origenSeleccionado: Aeropuerto | null = null;
  destinoSeleccionado: Aeropuerto | null = null;

  // Filtros
  filtroOrigen: string = '';
  filtroDestino: string = '';
  filtroOrigenActivo: boolean = false;
  filtroDestinoActivo: boolean = false;

  // Google Flights
  googleVuelos: GoogleFlight[] = [];
  googleFlightsUrl: string = '';
  cargandoGoogle: boolean = false;
  errorGoogle: string = '';
  sinResultadosGoogle: boolean = false;

  // Parámetros de la última búsqueda (para reusarlos en opciones de compra)
  private lastDepartureId: string = '';
  private lastArrivalId: string = '';
  private lastOutboundDate: string = '';

  // Modal opciones de compra
  modalAbierto: boolean = false;
  modalVuelo: GoogleFlight | null = null;
  modalGoogleFlightsUrl: string = '';
  opcionesCompra: BookingOptionDetail[] = [];
  cargandoOpciones: boolean = false;
  errorOpciones: string = '';

   constructor(
     private aeropuertoService: AeropuertoService,
     private vueloService: VueloService,
     private googleFlightsService: GoogleFlightsService,
     private busquedaHistoricaService: BusquedaHistoricaService,
     private router: Router
   ) {}

  ngOnInit(): void {
    this.aeropuertoService.obtenerAeropuertos().subscribe(lista => {
      this.aeropuertos = lista;
      this.aeropuertosFiltradosOrigen = lista;
      this.aeropuertosFiltradosDestino = lista;
    });
  }

  onFocusOutOrigen(event: FocusEvent): void {
    const related = event.relatedTarget as HTMLElement;
    if (!related || !(event.currentTarget as HTMLElement).contains(related)) {
      setTimeout(() => { this.filtroOrigenActivo = false; }, 100);
    }
  }

  onFocusOutDestino(event: FocusEvent): void {
    const related = event.relatedTarget as HTMLElement;
    if (!related || !(event.currentTarget as HTMLElement).contains(related)) {
      setTimeout(() => { this.filtroDestinoActivo = false; }, 100);
    }
  }

  toggleDropdownOrigen(): void {
    this.filtroDestinoActivo = false;
    this.filtroOrigenActivo = !this.filtroOrigenActivo;
    if (this.filtroOrigenActivo) {
      this.filtroOrigen = '';
      this.aeropuertosFiltradosOrigen = this.aeropuertos;
    }
  }

  cerrarDropdownOrigen(): void {
    this.filtroOrigenActivo = false;
  }

  seleccionarOrigen(a: Aeropuerto): void {
    this.origenSeleccionado = a;
    this.filtroOrigenActivo = false;
  }

  toggleDropdownDestino(): void {
    this.filtroOrigenActivo = false;
    this.filtroDestinoActivo = !this.filtroDestinoActivo;
    if (this.filtroDestinoActivo) {
      this.filtroDestino = '';
      this.aeropuertosFiltradosDestino = this.aeropuertos;
    }
  }

  cerrarDropdownDestino(): void {
    this.filtroDestinoActivo = false;
  }

  seleccionarDestino(a: Aeropuerto): void {
    this.destinoSeleccionado = a;
    this.filtroDestinoActivo = false;
  }

  swapAeropuertos(): void {
    const tmp = this.origenSeleccionado;
    this.origenSeleccionado = this.destinoSeleccionado;
    this.destinoSeleccionado = tmp;
  }

  filtrarOrigen(): void {
    this.aeropuertoService.buscarAeropuertos(this.filtroOrigen).subscribe(res => {
      this.aeropuertosFiltradosOrigen = res;
    });
  }

  filtrarDestino(): void {
    this.aeropuertoService.buscarAeropuertos(this.filtroDestino).subscribe(res => {
      this.aeropuertosFiltradosDestino = res;
    });
  }

   buscarVuelos(): void {
     if (!this.origenSeleccionado || !this.destinoSeleccionado || !this.fechaViaje) {
       Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor, complete todos los campos para realizar la búsqueda.' });
       return;
     }

     const origenCodigo = this.origenSeleccionado.codigo;
     const destinoCodigo = this.destinoSeleccionado.codigo;

     this.googleVuelos = [];
     this.errorGoogle = '';
     this.sinResultadosGoogle = false;
     this.cargandoGoogle = true;
     this.buscado = false;
     this.vuelos = [];

     this.lastDepartureId = origenCodigo;
     this.lastArrivalId = destinoCodigo;
     this.lastOutboundDate = this.fechaViaje;

     this.googleFlightsService.buscarVuelos(origenCodigo, destinoCodigo, this.fechaViaje).subscribe({
       next: (result: GoogleFlightsResult) => {
         this.googleVuelos = result.vuelos;
         this.googleFlightsUrl = result.googleFlightsUrl;
         this.cargandoGoogle = false;
         this.buscado = true;

         // Guardar búsqueda en el historial
         this.guardarBusquedaHistorial(origenCodigo, destinoCodigo);

         if (result.vuelos.length > 0) {
           Swal.fire({
             title: '¡Vuelos encontrados!',
             text: `Se encontraron ${result.vuelos.length} vuelo(s) en Google Flights.`,
             imageUrl: '/assets/disponibles.gif',
             imageWidth: 100, imageHeight: 100,
             icon: 'success'
           });
         } else {
           this.sinResultadosGoogle = true;
         }
       },
       error: (err: Error) => {
         const msg = err.message ?? '';
         if (msg.toLowerCase().includes("hasn't returned any results") || msg.toLowerCase().includes('fully empty')) {
           this.sinResultadosGoogle = true;
         } else {
           this.errorGoogle = msg || 'No se pudieron cargar vuelos de Google Flights.';
         }
         this.cargandoGoogle = false;
         this.buscado = true;
       }
     });
   }

   guardarBusquedaHistorial(origenCodigo: string, destinoCodigo: string): void {
     const usuario = localStorage.getItem('usuario');
     if (!usuario) return;

     const datosBusqueda = {
       username: usuario,
       engine: 'google_flights',
       departure_id: origenCodigo,
       arrival_id: destinoCodigo,
       outbound_date: this.fechaViaje,
       return_date: null,
       type: 2,
       currency: 'COP',
       hl: 'es',
       gl: 'co',
       adults: 1,
       cabin_class: 'economy'
     };

     this.busquedaHistoricaService.guardarBusqueda(datosBusqueda).subscribe({
       next: () => {
         console.log('Búsqueda guardada en el historial');
       },
       error: (err) => {
         console.warn('Error al guardar búsqueda en historial:', err);
       }
     });
   }

  getCodigoAeropuerto(id: number): string {
    const a = this.aeropuertos.find(x => x.id === id);
    return a ? a.codigo : '???';
  }

  getNombreCorto(id: number): string {
    const a = this.aeropuertos.find(x => x.id === id);
    return a ? a.nombre : '';
  }

  formatDuracion(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  getGoogleFlightFirstLeg(vuelo: GoogleFlight): GoogleFlightLeg | undefined {
    return vuelo.flights?.[0];
  }

  getGoogleFlightLastLeg(vuelo: GoogleFlight): GoogleFlightLeg | undefined {
    return vuelo.flights?.[vuelo.flights.length - 1];
  }

  getGoogleFlightEscalas(vuelo: GoogleFlight): number {
    return Math.max(0, (vuelo.flights?.length ?? 1) - 1);
  }

  abrirOpciones(gv: GoogleFlight): void {
    if (!gv.booking_token) {
      window.open(this.googleFlightsUrl, '_blank');
      return;
    }
    this.modalVuelo = gv;
    this.modalAbierto = true;
    this.opcionesCompra = [];
    this.errorOpciones = '';
    this.cargandoOpciones = true;

    this.googleFlightsService.obtenerOpcionesCompra(
      gv.booking_token,
      this.lastDepartureId,
      this.lastArrivalId,
      this.lastOutboundDate
    ).subscribe({
      next: (opts) => {
        this.opcionesCompra = opts.opciones;
        this.cargandoOpciones = false;
        if (opts.opciones.length === 0) this.errorOpciones = 'No se encontraron opciones de compra.';
      },
      error: (err) => {
        this.errorOpciones = err.message ?? 'Error al cargar opciones.';
        this.cargandoOpciones = false;
      }
    });
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.modalVuelo = null;
    this.opcionesCompra = [];
  }

  reservar(op: BookingOptionDetail): void {
    if (op.booking_request) {
      this.googleFlightsService.abrirReserva(op.booking_request);
    } else {
      window.open(this.googleFlightsUrl, '_blank');
    }
  }

  cerrarSesion(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
