import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-academic-info-step',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './academic-info-step.component.html',
  styleUrl: './academic-info-step.component.scss'
})
export class AcademicInfoStepComponent {

  @Input() formGroup!: FormGroup;
  @Input() studentType: 'new' | 'old' | null = null;
  @Input() levels: any[] = [];
  get faculty() {
    return this.formGroup?.get('faculty');
  }

  get level() {
    return this.formGroup?.get('level');
  }

  // For new students only
  get secondaryDivision() {
    return this.formGroup?.get('secondaryDivision');
  }

  get totalGradesHighSchool() {
    return this.formGroup?.get('totalGradesHighSchool');
  }

  // For old students only
  get previousAcademicYearGpa() {
    return this.formGroup?.get('previousAcademicYearGpa');
  }

  get housingInPreviousYears() {
    return this.formGroup?.get('housingInPreviousYears');
  }
 

}
