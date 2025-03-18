import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(catchError((err) =>{
     console.log('interceptor',err);
     console.log('interceptor err.error.message',err.error.message);
     const Toast = Swal.mixin({
         toast: true,
         position: 'top',
         iconColor: 'white',
         customClass: {
           popup: 'colored-toast',
         },
         showConfirmButton: false,
         timer: 3000,
         timerProgressBar: true,
       })
       Toast.fire({
        icon: 'error',
        title: err?.error?.message || 'حدث خطأ اثناء تنفيذ العملية',
      })
     return throwError(()=>err); }))
};
