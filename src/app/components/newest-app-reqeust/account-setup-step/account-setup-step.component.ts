import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-setup-step',
  standalone: true,
  imports: [NgIf , ReactiveFormsModule],
  templateUrl: './account-setup-step.component.html',
  styleUrl: './account-setup-step.component.scss'
})
export class AccountSetupStepComponent {
  @Input() formGroup!: FormGroup;
  @Input() isEditMode: boolean = false;
  
  
  get username() { return this.formGroup?.get('username'); }

  get password() {
    return this.formGroup?.get('password');
  }
  get rePassword() {
    return this.formGroup?.get('rePassword');
  }
  get specialNeeds() { // أو الاسم الجديد إذا غيرته
    return this.formGroup?.get('specialNeeds');
  }

  get confirmDataAccuracy(){
    return this.formGroup?.get('confirmDataAccuracy');
  }
}
