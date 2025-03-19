import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { headerInterceptor } from './core/interceptors/header.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { successInterceptor } from './core/interceptors/success.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes , withHashLocation(), withInMemoryScrolling({scrollPositionRestoration:"top",anchorScrolling: 'enabled',}) , withViewTransitions()),
     provideClientHydration(),
     provideHttpClient(withFetch(),withInterceptors([headerInterceptor,errorInterceptor,successInterceptor,loadingInterceptor])),
     provideAnimations() ,
     provideToastr(),
     importProvidersFrom(NgxSpinnerModule),
     provideAnimationsAsync(),
     provideAnimationsAsync(),
     provideAnimationsAsync(),
     provideCharts(withDefaultRegisterables()),
    ]
};
