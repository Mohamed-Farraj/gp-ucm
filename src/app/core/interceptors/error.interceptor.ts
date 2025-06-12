import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(AuthService);
  return next(req).pipe(
    catchError((err) => {
      console.log('interceptor', err);
      console.log('interceptor err.error.message', err.error?.message);
  
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
      });
  
      let message = 'حدث خطأ اثناء تنفيذ العملية';
  
      if (err.status === 401 || err.status === 403) {
        message = 'هذا المستخدم غير مسموح له بهذا الاجراء';
  
        // ✅ Redirect to login page if 401
        if (err.status === 401) {
          router.logout();
        }
      } else if (err.error?.message) {
        message = err.error.message;
      }

      if (err.status === 404) {
        
      } 
  
      else
      {
        Toast.fire({
          icon: 'error',
          title: message,
        });

      }
      
  
  
      return throwError(() => err);
    })
  );
  
};
