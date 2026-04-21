  import { ApplicationConfig } from '@angular/core';
  import { provideRouter, withInMemoryScrolling } from '@angular/router';
  import { provideHttpClient } from '@angular/common/http';  // Proveedor de HttpClient
  import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

  import { routes } from './app.routes';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideRouter(
        routes,
        withInMemoryScrolling({ 
        anchorScrolling: 'enabled', 
        scrollPositionRestoration: 'enabled'})
      ),      
      provideHttpClient(),        
      provideAnimationsAsync()   
    ]
  };
