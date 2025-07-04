import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-family-info-step',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './family-info-step.component.html',
  styleUrl: './family-info-step.component.scss'
})
export class FamilyInfoStepComponent {
  @Input() formGroup!: FormGroup;
 @Input() onFileSelected!: (file: File) => void;

handleFileInput(event: any) {
  const file = event.target.files[0];
  if (file && this.onFileSelected) {
    this.onFileSelected(file); // بعت الملف نفسه للـ parent
  }
}

  

  get fatherName() { return this.formGroup?.get('fatherName'); }
  get fatherNationalId() { return this.formGroup?.get('fatherNationalId'); }
  get fatherOccupation() { return this.formGroup?.get('fatherOccupation'); }
  get fatherPhoneNumber() { return this.formGroup?.get('fatherPhoneNumber'); }
  get guardianName() { return this.formGroup?.get('guardianName'); }
  get guardianRelationship() { return this.formGroup?.get('guardianRelationship'); }

  get guardianPhoneNumber() { return this.formGroup?.get('guardianPhoneNumber'); }
  get guardianNationalId() { return this.formGroup?.get('guardianNationalId'); }
  get parentsStatus() { return this.formGroup?.get('parentsStatus'); }
  get familyAbroad() { return this.formGroup?.get('familyAbroad'); }
  get media() { return this.formGroup?.get('media'); }


}
