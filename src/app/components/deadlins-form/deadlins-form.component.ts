import { DeadlineService } from './../../core/services/deadline.service';
import { Component, inject, Inject, OnInit, Output } from '@angular/core';
import { Ideadlins } from '../../core/interfaces/ideadlins';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { AddDeadlineComponent } from "../add-deadline/add-deadline.component";
import { EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-deadlins-form',
  standalone: true,
  imports: [],
  templateUrl: './deadlins-form.component.html',
  styleUrl: './deadlins-form.component.scss'
})
export class DeadlinsFormComponent  implements OnInit{



  isModelOpen = false;
  deadlines: Ideadlins[] = [];
  deadline!: Ideadlins;
   private readonly _deadlineService=inject(DeadlineService);
    private readonly toastr=inject(ToastrService);
    private readonly _formBuilder= inject(FormBuilder)
    public  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getDeadLine();
  }

  getDeadLine(){
    this._deadlineService.getDeadLine().subscribe({
      next: (res:any) => {
        if (res.data) {
          this.deadlines = res.data;
          console.log(this.deadlines);
        }
      },
      error: (err) => {console.log(err);},
    });
  }

  loadDeadline(deadline: Ideadlins) {
    this.deadline = deadline;
    this.openDialog(deadline);
  }

  deleteDeadline(id: number) {
    this._deadlineService.deleteDeadLine(id).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
  
        // Remove the deleted deadline from the local array
        this.deadlines = this.deadlines.filter(deadline => deadline.id !== id);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Failed to delete the deadline.');
      },
    });
  }

  updateDeadline(id:number , deadline: Ideadlins) {
    this._deadlineService.updateDeadLine(id,deadline).subscribe({
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
      data: deadline || null, // Pass data to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDeadLine(); // Refresh the list after the dialog is closed
      }
    });
  }
}
