import { MealsService } from './../../core/services/meals.service';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Imeals } from '../../core/interfaces/imeals';
import { ToastrService } from 'ngx-toastr';
import { MealsComponent } from '../meals/meals.component';

@Component({
  selector: 'app-mealform',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './mealform.component.html',
  styleUrl: './mealform.component.scss'
})
export class MealformComponent {
  // mealForm: FormGroup;
  isSubmitting = false;
  mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];

  private readonly mealsService = inject ( MealsService)
      private readonly _formBuilder= inject(FormBuilder)
      dialogRef = inject(MatDialogRef<MealsComponent>);
      data: Imeals = inject(MAT_DIALOG_DATA) || {} as Imeals;

  constructor(
  ) 
  {
    if (this.data) {
      this.mealForm.patchValue(this.data);
    }
  }
  ngOnInit() {
    console.log('Meal types:', this.mealTypes);
  }
  

  mealForm :FormGroup = this._formBuilder.group({
    mealDate: ['', Validators.required],
    mealType: ['', Validators.required],
    description: ['', Validators.required],
    image: ['']
  });


  ngOnChanges(): void {
    if (this.data) {
      this.mealForm.patchValue({
        mealDate: this.data.mealDate,
        mealType: this.data.mealType,
        description: this.data.description,
        image: this.data.image
      });
    }
  }

  onSubmit() {
    console.log('local storage before submission', localStorage.getItem('userToken'));
  
    if (this.mealForm.valid) {
      const formData = this.mealForm.value;
  
      if (this.data?.id) {
        this.mealsService.updateMeal(this.data?.id, formData).subscribe({
          next: (res: Imeals) => {
            this.dialogRef.close(true); // Close the dialog and return true
          },
          error: () => {
          }
        });
      } else {
        this.mealsService.mealForm(formData).subscribe({
          next: (res: Imeals) => {
            console.log(res);
            this.dialogRef.close(true); // Close the dialog and return true
          },
          error: () => {
          }
        });
      }
    } else {
      this.mealForm.markAllAsTouched();
    }
  }
  

  onClose(): void {
    this.dialogRef.close();
  }
  resetDeadlineForm() {
    this.mealForm.reset();
    this.onClose();
  }
}