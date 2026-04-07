import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';
import { BusquedaVuelosComponent } from './components/busqueda-vuelos/busqueda-vuelos.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './components/guards/auth.guard';

export const routes: Routes = [
  {
    path: '', component: LoginComponent,
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'busqueda-vuelos', component: BusquedaVuelosComponent, canActivate: [AuthGuard]
  },
  {
    path: 'registro', component: RegistroComponent
  },
];
