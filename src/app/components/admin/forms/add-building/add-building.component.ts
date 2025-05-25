import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BuildingsService } from '../../../../core/services/buildings.service';
import { SharedDataService } from '../../../../core/services/shared-data.service';
import { AddPenaltyComponent } from '../add-penalty/add-penalty.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Irooms } from '../../../../core/interfaces/irooms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-building',
  standalone: true,
  imports: [ReactiveFormsModule , FormsModule, CommonModule],
  templateUrl: './add-building.component.html',
  styleUrl: './add-building.component.scss'
})
export class AddBuildingComponent {
 private readonly _BuildingsService=inject (BuildingsService);
   private readonly _dataService = inject(SharedDataService);
   
    private readonly _formBuilder= inject(FormBuilder)
    dialogRef = inject(MatDialogRef<AddPenaltyComponent>);
    data: Irooms = inject(MAT_DIALOG_DATA) || {} as Irooms;
    buildingData: any = {};
    private destroy$ = new Subject<void>(); // Subject لتتبع التدمير


    constructor() {
      this._dataService.currentBuildingData.pipe(takeUntil(this.destroy$)).subscribe(data => {
        console.log('Received data:', data);
        this.buildingData = data; 
    
        // Update the form when userData is available
        this.addBuildingForm.patchValue({
          // buildingId: this.buildingData?.id
          universityId: this.buildingData?.data.building.university.id
        });
      });
    }

    addBuildingForm:FormGroup= this._formBuilder.group({
      name: ['', Validators.required],
      floorsCount: ['', Validators.required],
      wingsCount: ['', Validators.required],

      type: ['', Validators.required],
      universityId: [''],
      // buildingId: [this.buildingData?.id],
       
    })
    
    
  
    ngOnInit(): void {
      if (this.data) {
        const universityId = 1; // أو القيمة اللي تجيبها من API
        this.addBuildingForm.patchValue({ universityId });
      }
    }
  
    ngOnChanges(): void {
      if (this.data) {
        this.addBuildingForm.patchValue({
          name: this.data.building.name,
          type: this.data.building.type,
          universityId: [1],

        });
      }
    }
    
  
    onSubmit() {
      console.log('Form values:', this.addBuildingForm.value);
    
      if (!this.addBuildingForm.value.universityId) {
        console.error('Error: universityId is missing');
        return;
      }
    
      if (this.addBuildingForm.valid) {
        this._BuildingsService.addBuilding(this.addBuildingForm.value).subscribe({
          next: (res: any) => {
            console.log(res);
            this.dialogRef.close(true);
          },
        });
      } else {
        this.addBuildingForm.markAllAsTouched();
      }
    }
    
    onClose() {
      this.dialogRef.close(false); // Close the dialog without saving
    }
  
    resetDeadlineForm() {
      this.addBuildingForm.reset();
      this.onClose();
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}
