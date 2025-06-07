import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-academic-info-step',
  standalone: true,
  imports: [NgFor,ReactiveFormsModule],
  templateUrl: './academic-info-step.component.html',
  styleUrl: './academic-info-step.component.scss'
})
export class AcademicInfoStepComponent implements OnInit {

  @Input() formGroup!: FormGroup;
  @Input() studentType: 'new' | 'old' | null = null;
  @Input() levels: any[] = [];
  @Input() faculties: any[] = [];
  @Input() nameOfUniversities: any[] = [];
  @Input() facultiesMap: any = {};


   ngOnInit(): void {

    this.formGroup.get('universityId')?.valueChanges.subscribe(selectedUniversity => {
    this.faculties = this.facultiesMap[String(selectedUniversity) as keyof typeof this.facultiesMap] || [];
    this.formGroup.get('faculty')?.setValue('');
  });
  }

  get universityId() {
    return this.formGroup?.get('universityId');
  }
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
  get wantFood() {
    return this.formGroup?.get('wantFood');
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

  get houseTypeName() {
    return this.formGroup?.get('houseTypeName');
  }

  get annualGrade() {
    return this.formGroup?.get('annualGrade');
  }
 

}
