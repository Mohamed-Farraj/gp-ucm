import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);


  if (isPlatformBrowser(platformId)) 
  {
    if (localStorage.getItem('userToken') !== null) {
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
