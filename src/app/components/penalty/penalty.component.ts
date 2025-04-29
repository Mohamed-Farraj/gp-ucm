import { PenaltyService } from './../../core/services/penalty.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddPenaltyComponent } from '../add-penalty/add-penalty.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedDataService } from '../../core/services/shared-data.service';
import { Ipenalty } from '../../core/interfaces/ipenalty';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { UsersSideListComponent } from "../users-side-list/users-side-list.component";

@Component({
  selector: 'app-penalty',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './penalty.component.html',
  styleUrl: './penalty.component.scss'
})
export class PenaltyComponent {

 

   private readonly _penaltyService=inject (PenaltyService);
   private readonly _dataService = inject(SharedDataService);
   
    private readonly _formBuilder= inject(FormBuilder)
    dialogRef = inject(MatDialogRef<AddPenaltyComponent>);
    data: Ipenalty = inject(MAT_DIALOG_DATA) || {} as Ipenalty;
    userData: any = {};
    private destroy$ = new Subject<void>(); // Subject لتتبع التدمير


    constructor() {
      this._dataService.currentStudentData.pipe(takeUntil(this.destroy$)).subscribe(data => {
        console.log('Received data:', data);
        this.userData = data; 
    
        // Update the form when userData is available
        this.penaltyForm.patchValue({
          userId: this.userData?.userId
        });
      });
    }

    penaltyForm:FormGroup= this._formBuilder.group({
      penaltyTitle: ['', Validators.required],
      reason: ['', Validators.required],
      dateIssued: ['', Validators.required],
      userId: [this.userData?.userId], // Use optional chaining to avoid errors
         
    })
    
    
  
    ngOnInit(): void {
      if (this.data) {
        this.penaltyForm.patchValue(this.data); // Patch form with data if editing
      }
    }
  
    ngOnChanges(): void {
      if (this.data) {
        this.penaltyForm.patchValue({
          penaltyTitle: this.data.penaltyTitle,
          reason: this.data.reason,
          dateIssued: this.data.dateIssued,
          userId: this.data.user.userId,
        });
      }
    }
    
  
    onSubmit() {
      console.log('Form values:', this.penaltyForm.value);
    
      if (!this.penaltyForm.value.userId) {
        console.error('Error: userId is missing');
        return;
      }
    
      if (this.penaltyForm.valid) {
        this._penaltyService.createPenalty(this.penaltyForm.value).subscribe({
          next: (res: any) => {
            console.log(res);
            this.dialogRef.close(true);
          },
        });
      } else {
        this.penaltyForm.markAllAsTouched();
      }
    }
    
    onClose() {
      this.dialogRef.close(false); // Close the dialog without saving
    }
  
    resetDeadlineForm() {
      this.penaltyForm.reset();
      this.onClose();
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
   
  }


