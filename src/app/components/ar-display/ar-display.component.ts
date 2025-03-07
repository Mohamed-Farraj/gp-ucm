import { NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-ar-display',
  standalone: true,
  imports: [NgIf],
  templateUrl: './ar-display.component.html',
  styleUrl: './ar-display.component.scss'
})
export class ArDisplayComponent {

  private readonly _AuthService = inject(AuthService);

   Toast = Swal.mixin({
    toast: true,
    position: 'top',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  })
DecideAr(id:number = -1,status:string = 'UNDER_REVIEW') {
  if (id === -1) 
    {
      this.Toast.fire({
      icon: 'error',
      title: 'حدث خطأ في اختيار رقم المستخدم',
    })   
    }
    else{

      this._AuthService.DecideArState(id, status).subscribe({
        next: (response) => {
          console.log('Operation succeeded:', response);
          this.selectedAdmissionRequest.status = status;
          if (status === 'UNDER_REVIEW' ) {
            this.Toast.fire({
              icon: 'success',
              title: 'هذا الطلب تحت المراجعة',
            })   
          }
          
          else if (status === 'ACCEPTED' ) {
            this.Toast.fire({
              icon: 'success',
              title: 'قد تم قبول الطلب بنجاح',
            })   
          }
          else if (status === 'REJECTED' ) {
            this.Toast.fire({
              icon: 'success',
              title: 'قد تم رفض الطلب بنجاح',
            })   
          }
        },
        error: (err) => {
          console.error('Operation failed:', err);
          this.Toast.fire({
            icon: 'error',
            title: err.error.message,
          })   
        },
      });

     


    }
}

 @Input({required:true}) selectedAdmissionRequest :any = {};

}
