import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { routes } from './app.routes';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptor } from 'projects/sharedlibrary/src/services/auth-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
        // provideCharts(withDefaultRegisterables()),
        provideToastr(),
        provideAnimationsAsync(),
        importProvidersFrom(MatNativeDateModule),
        importProvidersFrom(HttpClientModule),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideCharts(withDefaultRegisterables())
  ]
};
