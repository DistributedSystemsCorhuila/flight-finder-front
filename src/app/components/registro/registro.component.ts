import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) {
    this.registroForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      favoriteDestinations: ''
    });
  }

  regresar() {
    this.router.navigate(['/login']);
  }

  registrarUsuario(): void {
    if (this.registroForm.invalid) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor, complete todos los campos antes de continuar.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.usuarioService.registrarUsuario(this.registroForm.value).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Registro Exitoso',
          text: 'El usuario ha sido registrado exitosamente',
          imageUrl: '/assets/aeronave.gif',
          imageWidth: 80,
          imageHeight: 80,
          imageAlt: 'Icono de éxito',
          timer: 1200,
          customClass: {
            popup: 'small-swal-popup'
          }
        }).then(() => {

          this.router.navigate(['/login']);
        });
        this.registroForm.reset();
      },
      error: (error) => {
        let mensajeError = 'Hubo un problema al registrar el usuario';

        if (error.status === 409 || error.status === 400) {
          mensajeError = 'El usuario o correo electrónico ya se encuentra registrado';
        } else if (error.status === 0) {
          mensajeError = 'No se pudo conectar con el servidor. Intente más tarde';
        }

        Swal.fire({
          title: 'Error',
          text: mensajeError,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
