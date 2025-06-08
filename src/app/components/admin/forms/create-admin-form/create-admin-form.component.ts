import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Iadmin } from '../../../../core/interfaces/iadmin';
import { AdminService } from '../../../../core/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-admin-form',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule ],
  templateUrl: './create-admin-form.component.html',
  styleUrl: './create-admin-form.component.scss'
})
export class CreateAdminFormComponent {
  dialogRef = inject(MatDialogRef<CreateAdminFormComponent>);
  data: Iadmin = inject(MAT_DIALOG_DATA);
  
  private readonly _adminService = inject(AdminService);
   adminForm!: FormGroup;
   roleOptions = [
     { id: 1, name: 'ADMIN' },
     { id: 2, name: 'EDIT_ADMIN' },
     { id: 3, name: 'ViEW_ADMIN' }
   ];
 
   constructor(private fb: FormBuilder) {}
 
   ngOnInit(): void 
   {
    //  if (this.data) {
    //   this.adminForm.patchValue(this.data); // Patch form with data if editing
    // }
     this.adminForm = this.fb.group({
       username: ['', [Validators.required, Validators.email]],
       password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
       role: ['', Validators.required]
     });
   }
 

    onSubmit() {
    console.log('local storage before submission',localStorage.getItem('userToken'));
    if (this.adminForm.valid) {
    
        this._adminService.createAdminAcc(this.adminForm.value).subscribe({
          next: (res: any) => {
           
            this.dialogRef.close(true); // Close the dialog and return true
          },
        });
      }
     else {
      this.adminForm.markAllAsTouched();
    }

  }

  onClose() {
    this.dialogRef.close(false); // Close the dialog without saving
  }

  resetAdminForm() {
    this.adminForm.reset();
    this.onClose();
  }
 
    


}
