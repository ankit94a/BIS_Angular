import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from 'projects/sharedlibrary/src/services/auth-interceptor.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { NgxSpinnerModule } from 'ngx-spinner';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';

PlotlyModule.plotlyjs = PlotlyJS;
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
  importProvidersFrom(PlotlyModule) ,
        provideToastr(),
        provideAnimationsAsync(),
        importProvidersFrom(MatNativeDateModule),
        importProvidersFrom([BrowserAnimationsModule]),
        importProvidersFrom(NgxSpinnerModule.forRoot({ type: 'ball-fussion' })),
        importProvidersFrom(HttpClientModule),
        importProvidersFrom(OwlNativeDateTimeModule),
        importProvidersFrom(OwlDateTimeModule),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideCharts(withDefaultRegisterables())
  ]
};
