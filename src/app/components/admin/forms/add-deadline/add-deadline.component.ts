import { Component, Inject, inject, Input, OnChanges, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { DeadlineService } from '../../../../core/services/deadline.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { Ideadlins } from '../../../../core/interfaces/ideadlins';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-deadline',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule ], // Add CommonModule here
  templateUrl: './add-deadline.component.html',
  styleUrls: ['./add-deadline.component.scss']
})
export class AddDeadlineComponent implements OnChanges {
  // @Input() data: Ideadlins | null = null;

  // @Output() onCloseModel = new EventEmitter<any>();

  private readonly _deadlineService=inject (DeadlineService);
  private readonly toastr=inject(ToastrService);
  private readonly _formBuilder= inject(FormBuilder)
  dialogRef = inject(MatDialogRef<AddDeadlineComponent>);
  data: Ideadlins = inject(MAT_DIALOG_DATA);
  
  deadlineForm:FormGroup= this._formBuilder.group({
    applicationStartDate: ['', Validators.required , ],
    applicationEndDate: ['', Validators.required],
    studentType: ['', Validators.required]
       
  }, {
     validators: [this.dateRangeValidator()]
  }
)

dateRangeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get('applicationStartDate')?.value;
    const end = group.get('applicationEndDate')?.value;

    if (!start || !end) return null; // Handled by required validators

    const startDate = new Date(start);
    const endDate = new Date(end);

    return endDate >= startDate
      ? null
      : { dateRangeInvalid: true };
  };
}


  ngOnInit(): void {
    if (this.data) {
      this.deadlineForm.patchValue(this.data); // Patch form with data if editing
    }
  }

  ngOnChanges(): void {
    if (this.data) {
      this.deadlineForm.patchValue({
        applicationStartDate: this.data.applicationStartDate,
        applicationEndDate: this.data.applicationEndDate,
        studentType: this.data.studentType,
      
      });
    }
  }

  onSubmit() {
    console.log('local storage before submission',localStorage.getItem('userToken'));
    if (this.deadlineForm.valid) {
      if (this.data) {
        this._deadlineService.updateDeadLine(this.data.id, this.deadlineForm.value).subscribe({
          next: (res: any) => {
            this.dialogRef.close(true); // Close the dialog and return true
          },
        });
      } else {
        this._deadlineService.addDeadLine(this.deadlineForm.value).subscribe({
          next: (res: any) => {
           
            this.dialogRef.close(true); // Close the dialog and return true
          },
        });
      }
    } else {
      this.deadlineForm.markAllAsTouched();
    }

  }

  onClose() {
    this.dialogRef.close(false); // Close the dialog without saving
  }

  resetDeadlineForm() {
    this.deadlineForm.reset();
    this.onClose();
  }
 
}