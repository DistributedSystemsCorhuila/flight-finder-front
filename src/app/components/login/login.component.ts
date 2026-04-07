import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioLogin } from '../../models/usuario-login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
})
export class LoginComponent implements OnInit {
  loginData: UsuarioLogin = { username: '', password: '' };
  isLoggedIn: boolean = false;

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      this.loginData.username = storedUser;
      this.isLoggedIn = true;
    }
  }

  login(event?: Event): void {
    if (event) {
      event.preventDefault(); 
    }
  
    if (this.loginData.username && this.loginData.password) {
      console.log('Enviando datos de inicio de sesión:', this.loginData);
      this.usuarioService.iniciarSesion(this.loginData).subscribe(
        (response: string) => {
          console.log('Respuesta del servidor:', response);
          localStorage.setItem('usuario', this.loginData.username);
          this.isLoggedIn = true;
          this.loginData.password = '';
  
          Swal.fire({
            title: '¡Bienvenido!',
            text: 'Inicio de sesión exitoso',
            imageUrl: '/assets/aeronave.gif',
            imageWidth: 100,
            imageHeight: 100,
            showConfirmButton: false,
            timer: 1500,
            position: 'center',
          }).then(() => {
            this.router.navigate(['/busqueda-vuelos']);
          });
        },
        (error) => {
          console.error('Error en la solicitud de inicio de sesión:', error);
          if (error.status === 401) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Nombre de usuario o contraseña incorrectos.',
              showConfirmButton: true,
              confirmButtonText: 'Reintentar',
              customClass: {
                confirmButton: 'btn btn-danger',
              },
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al procesar su solicitud. Intente de nuevo más tarde.',
              showConfirmButton: true,
              confirmButtonText: 'Entendido',
            });
          }
        }
      );
    } else {
      Swal.fire({
        title: 'Campos vacíos',
        text: 'Por favor, ingrese nombre de usuario y contraseña.',
        imageUrl: '/assets/camposvacios.gif',
        imageWidth: 100,
        imageHeight: 100,
        showConfirmButton: true,
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'btn btn-warning',
        },
      });
    }
  }
  

  logout(): void {
    localStorage.removeItem('usuario');
    this.isLoggedIn = false;
    this.loginData.username = '';
    this.router.navigate(['/']);
  }
}
