import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Ipenalty } from '../../../../core/interfaces/ipenalty';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddPenaltyComponent } from '../add-penalty/add-penalty.component';
import { SharedDataService } from '../../../../core/services/shared-data.service';
import { BuildingsService } from '../../../../core/services/buildings.service';
import { Irooms } from '../../../../core/interfaces/irooms';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [ReactiveFormsModule , FormsModule, CommonModule],
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.scss'
})
export class AddRoomComponent {
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
        this.addRoomForm.patchValue({
          buildingId: this.buildingData?.id
        });
      });
    }

    addRoomForm:FormGroup= this._formBuilder.group({
      roomNumber: ['', Validators.required],
      floorNumber: ['', Validators.required],
      wing: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      bedCount: ['', Validators.required],
      // occupiedBeds: ['', Validators.required],
      capacity: ['', Validators.required],
      // currentOccupancy: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required],
      buildingId: [this.buildingData?.id], // Use optional chaining to avoid errors
         
    })
    
    
  
    ngOnInit(): void {
      if (this.data) {
        this.addRoomForm.patchValue(this.data); // Patch form with data if editing
      }
    }
  
    ngOnChanges(): void {
      if (this.data) {
        this.addRoomForm.patchValue({
          roomNumber: this.data.roomNumber,
          capacity: this.data.capacity,
          currentOccupancy: this.data.currentOccupancy,
          type: this.data.type,
          status: this.data.status,
          buildingId: this.data.building.id,

        });
      }
    }
    
  
    onSubmit() {
      console.log('Form values:', this.addRoomForm.value);
    
      if (!this.addRoomForm.value.buildingId) {
        console.error('Error: userId is missing');
        return;
      }
    
      if (this.addRoomForm.valid) {
        this._BuildingsService.addRoom(this.addRoomForm.value).subscribe({
          next: (res: any) => {
            console.log(res);
            this.dialogRef.close(true);
          },
        });
      } else {
        this.addRoomForm.markAllAsTouched();
      }
    }
    
    onClose() {
      this.dialogRef.close(false); // Close the dialog without saving
    }
  
    resetDeadlineForm() {
      this.addRoomForm.reset();
      this.onClose();
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
   
  }




