import { Component, inject, OnInit } from '@angular/core';
import { Ipenalty } from '../../../../core/interfaces/ipenalty';
import { PenaltyService } from '../../../../core/services/penalty.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PenaltyComponent } from '../penalty/penalty.component';
import { SharedDataService } from '../../../../core/services/shared-data.service';
import { filter, Subject, takeUntil, tap } from 'rxjs';
import { DatePipe, NgIf } from '@angular/common';
import { UsersSideListComponent } from "../../display/users-side-list/users-side-list.component";
import { AuthService } from '../../../../core/services/auth.service';
import { PrivilegesDirective } from '../../../../core/directives/privileges.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-penalty',
  standalone: true,
  imports: [DatePipe, UsersSideListComponent, NgIf , PrivilegesDirective],
  templateUrl: './add-penalty.component.html',
  styleUrl: './add-penalty.component.scss'
})
export class AddPenaltyComponent  {

  
  
    isModelOpen = false;
    penalties: Ipenalty[] = [];
    penalty!: Ipenalty;
    allPenalties = []
     private readonly _PenaltyService=inject(PenaltyService);
     public readonly _AuthService = inject(AuthService)
     private readonly _dataService = inject(SharedDataService);
     private destroy$ = new Subject<void>(); // Subject لتتبع التدمير
      private readonly _formBuilder= inject(FormBuilder)
      public  dialog = inject(MatDialog);
  

      userData: any = {};


      constructor() {
        this._dataService.currentStudentData
          .pipe(
            tap(data => {
              console.log('Received data:', data);
              this.userData = data;  
              this.getPenaltyforSpecificUser(); // Fetch penalties immediately
            }),
            takeUntil(this.destroy$)
          )
          .subscribe();
      }
      
      

      

    ngOnInit(): void {
      this.getAllPenalties();
    }

    getAllPenalties() {

      this._PenaltyService.getAllpenalties().subscribe({
        next: (res: any) => {
          this.penalties = Array.isArray(res.data) ? res.data : [];
          console.log('Penalties for user:', this.penalties);
        },
        error: (err) => {
          console.error('Error fetching penalties:', err);
          this.penalties = []; 
        },
      });
    }
    


    getPenaltyforSpecificUser() {
      if (!this.userData?.userId) {
        this.getAllPenalties();
        return;
      }
    
      console.log(`Fetching penalties for user ID: ${this.userData.userId}`);
    
      this._PenaltyService.getPenaltyforSpecificUser(this.userData.userId).subscribe({
        next: (res: any) => {
          this.penalties = Array.isArray(res.data) ? res.data : [];
          console.log('Penalties for user:', this.penalties);
        },
        error: (err) => {
          console.error('Error fetching penalties:', err);
          this.penalties = []; 
        },
      });
    }
    
    loadPenalty(penalty: Ipenalty) {
      this.penalty = penalty;
      this.openDialog(penalty);
    }
  
    deletePenalty(id: number) {
  Swal.fire({
    title: 'هل أنت متأكد؟',
    text: 'لن تتمكن من التراجع عن هذا',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#e12e2e',
    cancelButtonColor: '#111b31',
    confirmButtonText: 'نعم، احذفه',
    cancelButtonText: 'تراجع'
  }).then((result) => {
    if (result.isConfirmed) {
      this._PenaltyService.deletePenalty(id).subscribe({
        next: (res: any) => {
          console.log(res);
          this.penalties = this.penalties.filter(penalty => penalty.id !== id);
          Swal.fire({
            title: 'تم الحذف!',
            text: 'تم حذف العقوبة بنجاح.',
            icon: 'success'
          });
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            title: 'خطأ!',
            text: 'حدث خطأ أثناء الحذف.',
            icon: 'error'
          });
        },
      });
    }
  });
}

    // updateDeadline(id:number , deadline: Ideadlins) {
    //   this._PenaltyService.updateDeadLine(id,deadline).subscribe({
    //     next: (res:any) => {
    //       this.toastr.success(res.message);
    //       this.getDeadLine();
    //     },
    //     error: (err) => {console.log(err);},
    //   });
    // }
  
    // openModel() {
    //   this.isModelOpen = true;
    // }
  
    // closeModel() {
      
    //   this.isModelOpen = false;
    //   this.getDeadLine();
    // }
  
    openDialog(penalty?: Ipenalty): void {
      const dialogRef = this.dialog.open(PenaltyComponent, {
        width: '50%', // Set the width of the dialog
        data: penalty || null, // Pass data to the dialog
         panelClass: 'custom-dialog-container'
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getPenaltyforSpecificUser(); // Refresh the list after the dialog is closed
        }
      });
    }


    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
    


}
