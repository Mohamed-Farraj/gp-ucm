import { Component, inject, OnInit } from '@angular/core';
import { Ipenalty } from '../../core/interfaces/ipenalty';
import { PenaltyService } from '../../core/services/penalty.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PenaltyComponent } from '../penalty/penalty.component';
import { SharedDataService } from '../../core/services/shared-data.service';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-add-penalty',
  standalone: true,
  imports: [],
  templateUrl: './add-penalty.component.html',
  styleUrl: './add-penalty.component.scss'
})
export class AddPenaltyComponent  {

  
  
    isModelOpen = false;
    penalties: Ipenalty[] = [];
    penalty!: Ipenalty;
     private readonly _PenaltyService=inject(PenaltyService);
     private readonly _dataService = inject(SharedDataService);
     
      private readonly _formBuilder= inject(FormBuilder)
      public  dialog = inject(MatDialog);
  

      userData: any = {};


      constructor() {
        this._dataService.currentStudentData
          .pipe(
            tap(data => {
              console.log('Received data:', data);
              this.userData = data;  
              this.getPenaltyforSpecificUser(); // Fetch penalties immediately
            })
          )
          .subscribe();
      }
      
      

      

    // ngOnInit(): void {
    //   this.getPenaltyforSpecificUser();
    // }
  
    getPenaltyforSpecificUser() {
      if (!this.userData?.userId) {
        console.warn('No user ID selected yet.');
        return;
      }
    
      console.log(`Fetching penalties for user ID: ${this.userData.userId}`);
    
      this._PenaltyService.getPenaltyforSpecificUser(this.userData.userId).subscribe({
        next: (res: any) => {
          this.penalties = Array.isArray(res.data) ? res.data : [];
          console.log('Penalties for user:', this.penalties);
        },
        error: (err) => {
          console.error('Error fetching penalties:', err);
          this.penalties = []; 
        },
      });
    }
    
    loadPenalty(penalty: Ipenalty) {
      this.penalty = penalty;
      this.openDialog(penalty);
    }
  
    deletePenalty(id: number) {
      this._PenaltyService.deletePenalty(id).subscribe({
        next: (res: any) => {
          console.log(res);
          // Remove the deleted deadline from the local array
          this.penalties = this.penalties.filter(penalty  => penalty.id !== id);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  
    // updateDeadline(id:number , deadline: Ideadlins) {
    //   this._PenaltyService.updateDeadLine(id,deadline).subscribe({
    //     next: (res:any) => {
    //       this.toastr.success(res.message);
    //       this.getDeadLine();
    //     },
    //     error: (err) => {console.log(err);},
    //   });
    // }
  
    // openModel() {
    //   this.isModelOpen = true;
    // }
  
    // closeModel() {
      
    //   this.isModelOpen = false;
    //   this.getDeadLine();
    // }
  
    openDialog(penalty?: Ipenalty): void {
      const dialogRef = this.dialog.open(PenaltyComponent, {
        width: '50%', // Set the width of the dialog
        data: penalty || null, // Pass data to the dialog
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getPenaltyforSpecificUser(); // Refresh the list after the dialog is closed
        }
      });
    }



}
