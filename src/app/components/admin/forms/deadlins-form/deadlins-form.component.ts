import { DeadlineService } from './../../../../core/services/deadline.service';
import { Component, inject, Inject, OnInit, Output } from '@angular/core';
import { Ideadlins } from '../../../../core/interfaces/ideadlins';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { AddDeadlineComponent } from "../../../admin/forms/add-deadline/add-deadline.component";
import { EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { PrivilegesDirective } from '../../../../core/directives/privileges.directive';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-deadlins-form',
  standalone: true,
  imports: [NgIf,PrivilegesDirective],
  templateUrl: './deadlins-form.component.html',
  styleUrl: './deadlins-form.component.scss'
})
export class DeadlinsFormComponent  implements OnInit{



  isModelOpen = false;
  uid:number = 1;
  deadlines: Ideadlins[] = [];
  deadline!: Ideadlins;
   private readonly _deadlineService=inject(DeadlineService);
   public readonly _AuthService = inject(AuthService)
    private readonly toastr=inject(ToastrService);
    private readonly _formBuilder= inject(FormBuilder)
    public  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getDeadLine();
  }

  getDeadLine(uid:number = 1) {
    this.uid = uid
    this._deadlineService.getDeadLine(this.uid).subscribe({
      next: (res:any) => {
        if (res.data) {
          this.deadlines = res.data;
          console.log(this.deadlines);
        }
      },
      error: (err) => {
        console.log(err);
        this.deadlines = [];
      },
    });
  }

  loadDeadline(deadline: Ideadlins) {
    this.deadline = deadline;
    this.openDialog(deadline);
  }

 deleteDeadline(id: number) {
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
      this._deadlineService.deleteDeadLine(this.uid, id).subscribe({
        next: (res: any) => {
          // Remove the deleted deadline from the local array
          this.deadlines = this.deadlines.filter(deadline => deadline.id !== id);
          Swal.fire({
            title: 'تم الحذف!',
            text: 'تم حذف الموعد النهائي بنجاح.',
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

  updateDeadline(id:number , deadline: Ideadlins) {
    this._deadlineService.updateDeadLine(this.uid,id,deadline).subscribe({
      next: (res:any) => {
        this.getDeadLine();
      },
      error: (err) => {console.log(err);},
    });
  }

  // openModel() {
  //   this.isModelOpen = true;
  // }

  // closeModel() {
    
  //   this.isModelOpen = false;
  //   this.getDeadLine();
  // }

  openDialog(deadline?: Ideadlins): void {
    const dialogRef = this.dialog.open(AddDeadlineComponent, {
      width: '50%', // Set the width of the dialog
     data: {
      ...deadline,
      uid: this.uid // ← أضف الـ uid هنا
    }, // Pass data to the dialog
      panelClass: 'custom-dialog-container'

    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDeadLine(this.uid); // Refresh the list after the dialog is closed
      }
    });
  }
}
