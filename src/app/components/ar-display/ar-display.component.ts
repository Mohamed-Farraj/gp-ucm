import { NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { TableViewUsersListComponent } from '../table-view-users-list/table-view-users-list.component';
import { SharedDataService } from '../../core/services/shared-data.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ArService } from '../../core/services/ar.service';


@Component({
  selector: 'app-ar-display',
  standalone: true,
  imports: [NgIf],
  templateUrl: './ar-display.component.html',
  styleUrl: './ar-display.component.scss'
})
export class ArDisplayComponent {

  private readonly _AuthService = inject(AuthService);
  private readonly router = inject(ActivatedRoute);
  private readonly  ar = inject(ArService);
  private readonly dataService = inject(SharedDataService);
  private destroy$ = new Subject<void>(); // Subject لتتبع التدمير

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
    confirmation(id: number = -1, status: string = 'UNDER_REVIEW', item?: any) {
          const procedure = status === 'ACCEPTED' ? 'قبول' : 
                           (status === 'UNDER_REVIEW' ? 'مراجعة' : 'رفض');
          
          const commonSwalConfig = {
              title: "هل انت متأكد؟",
              icon: "warning" as const,
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              cancelButtonText: "الغاء",
              allowOutsideClick: () => !Swal.isLoading()
          };
      
          if (status === 'REJECTED') {
              Swal.fire({
                  ...commonSwalConfig,
                  title: "ادخل سبب رفض هذا الطلب",
                  input: "text",
                  inputAttributes: {
                      autocapitalize: "off"
                  },
                  confirmButtonText: `${procedure} هذا الطلب؟`,
                  preConfirm: (reason) => {
                      if (!reason) {
                          Swal.showValidationMessage('يجب ادخال سبب الرفض');
                          return false;
                      }
                      return reason;
                  }
              }).then((result) => {
                  if (result.isConfirmed) {
                    console.log("thats a rejection reason",result.value);
                      this.DecideAr(id, status);
                  }
              });
          } else {
              Swal.fire({
                  ...commonSwalConfig,
                  confirmButtonText: `${procedure} هذا الطلب؟`,
              }).then((result) => {
                  if (result.isConfirmed) {
                      this.DecideAr(id, status);
                  }
              });
          }
      }
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
          this.applicationRequest.status = status;
          this.getUser();
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

 @Input() selectedAdmissionRequest :any = {};
  applicationRequest :any = {};

 ngOnInit(): void {
  this.getIdFromRoute();
  this.dataService.currentStudentData.pipe(takeUntil(this.destroy$)).subscribe(data => {
    this.selectedAdmissionRequest = data;
    
  })


  this.getUser();
  

 }

 getUser(){
  this.ar.getSpecificApplication(this.getIdFromRoute()).subscribe({
    next: (response) => {
      console.log('Operation succeeded:', response);
      this.applicationRequest = response?.data;
    },
    error: (err) => {
      console.error('Operation failed:', err);
      this.Toast.fire({
        icon: 'error',
        title: err.error.message,
      })   
    },
  })
 }

 getIdFromRoute():number
 {
   let id:string = "-1"; 
   this.router.paramMap.subscribe(params => {
     id = params.get('id')!;
     console.log('ID from route:',JSON.parse(id));
    });
    return JSON.parse(id);
 }

 ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

}
