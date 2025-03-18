import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

export const successInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap((event: HttpEvent<any>) => {
      // Check if it's a successful response and not GET request
      if (event.type === 4 && req.method !== 'GET') { // type 4 = HttpResponse
        const response = event.body;
        
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

        // Show success message from API or default
        if (response && response.message) {
          Toast.fire({
            icon: 'success',
            title: response.message,
          });
        } else if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
          Toast.fire({
            icon: 'success',
            title: 'تم تنفيذ العملية بنجاح',
          });
        }
      }
    })
  );
};