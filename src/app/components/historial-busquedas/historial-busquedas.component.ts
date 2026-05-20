import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusquedaHistoricaService } from '../../services/busqueda-historica.service';
import { BusquedaHistorica } from '../../models/busqueda-historica.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-historial-busquedas',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './historial-busquedas.component.html',
  styleUrls: ['./historial-busquedas.component.css']
})
export class HistorialBusquedasComponent implements OnInit {
  busquedas: BusquedaHistorica[] = [];
  cargando = false;
  error: string | null = null;
  username: string = '';

  constructor(private busquedaService: BusquedaHistoricaService) {}

  ngOnInit(): void {
    // Obtener el username del localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.username = usuarioGuardado;
      this.cargarHistorial();
    } else {
      this.error = 'No se encontró usuario autenticado';
    }
  }

  cargarHistorial(): void {
    this.cargando = true;
    this.error = null;

    this.busquedaService.obtenerHistoricoPorUsuario(this.username).subscribe({
      next: (datos) => {
        this.busquedas = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
        this.error = 'Error al cargar el historial de búsquedas';
        this.cargando = false;
      }
    });
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTipoBusqueda(type: number): string {
    return type === 1 ? 'Ida y vuelta' : 'Solo ida';
  }
}

