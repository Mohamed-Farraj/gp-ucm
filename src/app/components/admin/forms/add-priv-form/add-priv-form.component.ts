import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../../../core/services/admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrivilegesService } from '../../../../core/services/privileges.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ipriv } from '../../../../core/interfaces/ipriv';

@Component({
  selector: 'app-add-priv-form',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule , NgSelectModule ],
  templateUrl: './add-priv-form.component.html',
  styleUrl: './add-priv-form.component.scss'
})
export class AddPrivFormComponent {
 dialogRef = inject(MatDialogRef<AddPrivFormComponent>);
 data = inject<{ userId: number }>(MAT_DIALOG_DATA);

  private readonly _adminService = inject(AdminService);
  private readonly _PrivilegeService = inject(PrivilegesService);
   privForm!: FormGroup;
   Privilegeives: Ipriv[] = [];
 
   constructor(private fb: FormBuilder) {}
 
   ngOnInit(): void 
   {
    //  if (this.data) {
    //   this.adminForm.patchValue(this.data); // Patch form with data if editing
    // }
     this.privForm = this.fb.group({
      userId: [null , [Validators.required] ],
      privilegeIds: [[], [Validators.required]],
     });

     this.getAllPrivileges()
     
      if (this.data?.userId) {
        console.log('userId',this.data?.userId);
    this.privForm.patchValue({ userId: this.data.userId });}


   }
 
   getAllPrivileges() {
    this._PrivilegeService.getAllPrivileges().subscribe({
      next: (res: any) => {
        console.log('privileges ressss',res);
        this.Privilegeives = res.data;
        console.log('privileges array',this.Privilegeives);
      },
    });
  }


    onSubmit() {
    console.log(this.privForm.value);
    
    if (this.privForm.valid) {
    
        this._PrivilegeService.assignPrivileges(this.privForm.value).subscribe({
          next: (res: any) => {
           
            this.dialogRef.close(true); // Close the dialog and return true
          },
        });
      }
     else {
      this.privForm.markAllAsTouched();
    }

  }

  onClose() {
    this.dialogRef.close(false); // Close the dialog without saving
  }

  resetAdminForm() {
    this.privForm.reset();
    this.onClose();
  }
 
    


}
