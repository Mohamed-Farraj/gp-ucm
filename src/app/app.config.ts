import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes , withHashLocation(), withInMemoryScrolling({scrollPositionRestoration:"top",anchorScrolling: 'enabled',}) , withViewTransitions()), provideClientHydration(), provideHttpClient(withFetch()),provideAnimations()]
};
