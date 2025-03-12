import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes , withHashLocation(), withInMemoryScrolling({scrollPositionRestoration:"top",anchorScrolling: 'enabled',}) , withViewTransitions()), provideClientHydration(), provideHttpClient(withFetch()),provideAnimations() ,  provideToastr(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),]
};
