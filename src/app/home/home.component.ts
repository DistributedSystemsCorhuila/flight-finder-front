import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  planeAnimating = false;

  constructor(private router: Router) {}

  irABuscarVuelos(): void {
    const usuario = localStorage.getItem('usuario');

    if (usuario) {
      // Usuario autenticado - animar y redirigir a búsqueda de vuelos
      this.planeAnimating = true;
      setTimeout(() => {
        this.router.navigate(['/busqueda-vuelos']);
      }, 500);
    } else {
      // No autenticado - animar y redirigir a login
      this.planeAnimating = true;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 500);
    }
  }
}
