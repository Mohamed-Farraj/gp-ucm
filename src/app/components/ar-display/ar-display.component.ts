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

 @Input() selectedAdmissionRequest :any = {};
  applicationRequest :any = {};

 ngOnInit(): void {
  this.getIdFromRoute();
  this.dataService.currentStudentData.pipe(takeUntil(this.destroy$)).subscribe(data => {
    this.selectedAdmissionRequest = data;
    
  })


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
