import { ApplicationConfig, importProvidersFrom, NgModule, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from 'projects/sharedlibrary/src/services/auth-interceptor.service';
import { appConfig } from 'projects/clerk/src/app/app.config';
import { appConfig as ClerkAppConfig } from 'projects/clerk/src/app/app.config';
@NgModule({})
export class ClerkAppModule {
  static forRoot(){
    return {
      ngModule:appConfig,
      providers:[]
    }
  }
}

export const AppConfig: ApplicationConfig = {
   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
          // provideCharts(withDefaultRegisterables()),

      ...ClerkAppConfig.providers,
          provideToastr(),
          provideAnimationsAsync(),
          importProvidersFrom(MatNativeDateModule),
          importProvidersFrom(HttpClientModule),
          // importProvidersFrom(OwlNativeDateTimeModule),
          provideHttpClient(withInterceptors([authInterceptor])),
          provideCharts(withDefaultRegisterables())
    ]
};
