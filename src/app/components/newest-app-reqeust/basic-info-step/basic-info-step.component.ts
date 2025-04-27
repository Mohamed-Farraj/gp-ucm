import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-basic-info-step',
  standalone: true,
  imports: [ReactiveFormsModule , NgIf],
  templateUrl: './basic-info-step.component.html',
  styleUrl: './basic-info-step.component.scss'
})
export class BasicInfoStepComponent {

  @Input() formGroup!: FormGroup;

  get firstName() {
    return this.formGroup?.get('firstName');
  }

  get lastName() {
    return this.formGroup?.get('lastName');
  }

  get dateOfBirth() {
    return this.formGroup?.get('dateOfBirth');
  }

  get gender() {
    return this.formGroup?.get('gender');
  }

  get placeOfBirth() {
    return this.formGroup?.get('placeOfBirth');
  }

  get nationalId() {
    return this.formGroup?.get('nationalId');
  }
  get religion() {
    return this.formGroup?.get('religion');
  }
}
