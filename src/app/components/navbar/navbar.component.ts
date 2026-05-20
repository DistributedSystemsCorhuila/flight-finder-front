import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  usuarioAutenticado = false;
  username: string = '';
  planeAnimating = false;
  planeCrashing = false;
  rutaActual: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.verificarAutenticacion();
    // Detectar la ruta actual
    this.rutaActual = this.router.url;
    // Suscribirse a cambios de navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.rutaActual = event.urlAfterRedirects || event.url;
      });
  }

  verificarAutenticacion(): void {
    const usuario = localStorage.getItem('usuario');
    this.usuarioAutenticado = !!usuario;
    this.username = usuario || '';
  }

  estaEnBusquedaVuelos(): boolean {
    return this.rutaActual.includes('/busqueda-vuelos');
  }

  estaEnHistorialBusquedas(): boolean {
    return this.rutaActual.includes('/historial-busquedas');
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  cerrarSesion(): void {
    this.planeCrashing = true;
    setTimeout(() => {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      this.usuarioAutenticado = false;
      this.menuOpen = false;
      this.router.navigate(['/home']);
    }, 1200);
  }

  irABuscarVuelos(): void {
    this.planeAnimating = true;
    setTimeout(() => {
      this.router.navigate(['/busqueda-vuelos']);
    }, 500);
  }
}
