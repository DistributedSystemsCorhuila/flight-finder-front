import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { Vuelo } from '../../models/vuelo.model';
import { Aeropuerto } from '../../models/aeropuerto.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AeropuertoService } from '../../services/aeropuerto.service';
import { VueloService } from '../../services/vuelo-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-busqueda-vuelos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './busqueda-vuelos.component.html',
  styleUrls: ['./busqueda-vuelos.component.css']
})
export class BusquedaVuelosComponent implements OnInit {
  origenId: number = 0;
  destinoId: number = 0;
  fechaViaje: string = '';
  vuelos: Vuelo[] = [];
  aeropuertos: Aeropuerto[] = [];

  constructor(
    private aeropuertoService: AeropuertoService,
    private vueloService: VueloService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.cargarAeropuertos();
  }

  cargarAeropuertos(): void {
    this.aeropuertoService.obtenerAeropuertos().subscribe(
      (aeropuertos: Aeropuerto[]) => {
        this.aeropuertos = aeropuertos;
      },
      (error) => {
        console.error('Error al cargar los aeropuertos:', error);
      }
    );
  }
  buscarVuelos(): void {
    if (this.origenId && this.destinoId && this.fechaViaje) {
        console.log('Origen ID:', this.origenId);
        console.log('Destino ID:', this.destinoId);
        console.log('Fecha de viaje:', this.fechaViaje);

        this.vueloService.buscarVuelos(this.origenId, this.destinoId, this.fechaViaje).subscribe(
            (resultados: Vuelo[]) => {
                if (resultados.length > 0) {
                    this.vuelos = resultados;
                    console.log('Resultados de la búsqueda:', resultados);

                    Swal.fire({
                      title: '¡Vuelos encontrados!',
                      text: 'Hay vuelos disponibles para la ruta y fecha seleccionadas.',
                      imageUrl: '/assets/disponibles.gif', 
                      imageWidth: 100,
                      imageHeight: 100,
                      imageAlt: 'Vuelos disponibles',
                      icon: 'success'
                    });
                } else {
                    Swal.fire({
                      icon: 'info',
                      title: 'Sin resultados',
                      text: 'No hay vuelos disponibles para la ruta y fecha seleccionadas.'
                    });
                    this.vuelos = [];
                }
            },
            (error) => {
                console.error('Error al buscar vuelos:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Hubo un error al buscar los vuelos. Intente de nuevo más tarde.'
                });
            }
        );
    } else {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor, complete todos los campos para realizar la búsqueda.'
        });
    }
  }

  getNombreAeropuerto(id: number): string {
    const aeropuerto = this.aeropuertos.find(a => a.id === id);
    return aeropuerto ? `${aeropuerto.nombre} (${aeropuerto.codigo})` : 'Desconocido';
  }

  cerrarSesion(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']); 
  }
}
