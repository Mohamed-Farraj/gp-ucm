import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const auth = inject(AuthService);


  if (isPlatformBrowser(platformId)) 
  {
    if (localStorage.getItem('role') === 'ADMIN') {
    return true;
  }

  else
  {
    router.navigate(['/guest/login'])
    return false;
  }
  } else {
    return false
  }

};
