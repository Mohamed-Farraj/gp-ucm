import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Iuniversity } from '../../core/interfaces/iuniversity';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UniversityService } from '../../core/services/university.service';

@Component({
  selector: 'app-university-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './university-form.component.html',
  styleUrl: './university-form.component.scss'
})
export class UniversityFormComponent {
    private readonly _universityService = inject(UniversityService);
    private readonly _formBuilder= inject(FormBuilder)
 dialogRef = inject(MatDialogRef<UniversityFormComponent>);
  data: Iuniversity = inject(MAT_DIALOG_DATA);
  
  universityForm:FormGroup= this._formBuilder.group({
    name: ['', Validators.required],     
  })
   ngOnChanges(): void {
    if (this.data) {
      this.universityForm.patchValue({
        name: this.data.name,

      
      });
    }
  }

     onSubmit() {
    console.log('local storage before submission',localStorage.getItem('userToken'));
    if (this.universityForm.valid) {
      if (this.data) {
        this._universityService.updateUniversity(this.data.id, this.universityForm.value).subscribe({
          next: (res: any) => {
            console.log(' im here  ') 
            this.dialogRef.close(true); // Close the dialog and return true
          },
        });
      } else {
        this._universityService.addUniversity(this.universityForm.value).subscribe({
          next: (res: any) => {
            console.log(' im here  ')
            this.dialogRef.close(true); // Close the dialog and return true
          },
        });
      }
    } else {
      this.universityForm.markAllAsTouched();
    }

  }

  onClose() {
    this.dialogRef.close(false); // Close the dialog without saving
  }

  resetDeadlineForm() {
    this.universityForm.reset();
    this.onClose();
  }



}



