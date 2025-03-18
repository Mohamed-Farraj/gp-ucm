import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && window.localStorage) {
    const myToken = localStorage.getItem('userToken');
    
    if (myToken) {

      if(req.url.includes(""))
      {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${myToken}` // Consider using standard Authorization header
          }
        });
      }


    }
  }

  return next(req);
};
