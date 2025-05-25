import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ArService } from '../../../../core/services/ar.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ar-table',
  standalone: true,
  imports: [NgIf,],
  templateUrl: './ar-table.component.html',
  styleUrl: './ar-table.component.scss'
})
export class ArTableComponent {

  @Input({required: true}) res: any[] = [];
  private readonly router = inject(Router);
  public readonly _AuthService = inject(AuthService);
  private readonly ar = inject(ArService);
 
  
    RowClick(item:any): void {
      console.log("hello there this is on row click", item);
      this.router.navigate(['admin/details', item.userId]);
    }

    
    DecideAr(id:number = -1,status:string = 'UNDER_REVIEW',item?:any, message?:string) {
      if (id === -1) 
        {
          this.Toast.fire({
          icon: 'error',
          title: 'حدث خطأ في اختيار رقم المستخدم',
        })   
        }
        else{
    
          this._AuthService.DecideArState(id, status,message ).subscribe({
            next: (response) => {
              console.log('Operation succeeded:', response);
              item.status = status;
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
                    this.DecideAr(id, status, item,result.value);
                }
            });
        } else {
            Swal.fire({
                ...commonSwalConfig,
                confirmButtonText: `${procedure} هذا الطلب؟`,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.DecideAr(id, status, item);
                }
            });
        }
    }

      getLevel(level:string){
        if(level.includes('first'))
        {
          return '1'
        }
        else if(level.includes('second'))
        {
          return '2'
        }
        else if(level.toLowerCase().includes('third'))
        {
          return '3'
        }
        else if(level.includes('fourth'))
        {
          return '4'
        }
        else if(level.includes('fifth'))
        {
          return '5'
        }
        else
        {
          return level
        }
      }
  
    


}
