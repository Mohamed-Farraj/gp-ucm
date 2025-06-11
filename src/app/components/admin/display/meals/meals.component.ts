import { Imeals } from '../../../../core/interfaces/imeals';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MealformComponent } from '../../forms/mealform/mealform.component';
import { MealsService } from '../../../../core/services/meals.service';
import { ToastrService } from 'ngx-toastr';
import { PrivilegesDirective } from '../../../../core/directives/privileges.directive';

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [PrivilegesDirective],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss'
})
export class MealsComponent implements OnInit {

  meals: Imeals[] = [];
  meal!: Imeals;
  isLoading = false;
  public  dialog = inject(MatDialog);
  private readonly mealsService = inject ( MealsService )
  constructor( 
  ) {}

  ngOnInit(): void {
    this.loadMeals();
  }

  loadMeals(): void {
    this.mealsService.getAllMeals().subscribe({
      next: (res: any) => {
        console.log(res);
        this.meals = res.data;
      
      },
      error: (err) => {
       
      }
    });
  }

   loadDeadline(meal: Imeals) {
      this.meal = meal;
      this.openDialog(meal);
    }

     updateMeal(id:number , meal: Imeals) {
        this.mealsService.updateMeal(id,meal).subscribe({
          next: (res:any) => {
            this.loadMeals();
          },
          error: (err) => {console.log(err);},
        });
      }
    




      openDialog(meal?: Imeals): void {
          const dialogRef = this.dialog.open(MealformComponent, {
            width: '35%',
            data: meal || null, // Pass data to the dialog
            panelClass: 'custom-dialog-container'
          });
      
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.loadMeals(); // Refresh the list after the dialog is closed
            }
          });
        }




  // openDialog(meal?: Imeals): void {
  //   const dialogRef = this.dialog.open(MealformComponent, {
  //     width: '50%',
  //     data: meal || null,
  //   });
  
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       // إضافة الوجبة الجديدة للقائمة إذا كانت عملية إضافة
  //       if (!meal) {
  //         this.meals.unshift(result.data);
  //       }
  //       // أو استدعاء loadMeals() لتحديث كل البيانات من الخادم
  //       this.loadMeals();
  //     }
  //   });
  // }
  
  // openEditDialog(meal: Imeals): void {
  //   const dialogRef = this.dialog.open(MealformComponent, {
  //     width: '50%',
  //     data: meal
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       // تحديث الوجبة في القائمة مباشرة
  //       const index = this.meals.findIndex(m => m.id === result.data.id);
  //       if (index !== -1) {
  //         this.meals[index] = result.data;
  //       }
  //     }
  //   });
  // }
  
  deleteMeal(id: number): void {
    
      this.mealsService.deleteMeal(id).subscribe({
        next: (response) => {
          // إزالة الوجبة من القائمة مباشرة
          this.meals = this.meals.filter(meal => meal.id !== id);
        },
        error: (err) => {
        }
      });
    
  }
  }

