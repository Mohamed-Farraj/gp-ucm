import { Component, EventEmitter, inject, input, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, filter, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BuildingsService } from '../../core/services/buildings.service';
import { ExcelService } from '../../core/services/excel.service';
import { SharedDataService } from '../../core/services/shared-data.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ArService } from '../../core/services/ar.service';

@Component({
  selector: 'app-assign-row',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './assign-row.component.html',
  styleUrl: './assign-row.component.scss'
})
export class AssignRowComponent {

  //#region attributes
      filteredBuildings: any[] = [];
      buildingId:any;
      res: any[] = []; // البيانات الأصلية
      resRooms: any[] = []; // البيانات الأصلية
      @Input({required: true}) resBuildings: any; // البيانات الأصلية
      @Input({required: true})student: any ;
    
          //#region pagination attributes
        selectedAdmissionRequest: any = {};
        selectedBuilding: any = {};
        isCollapsed: boolean = true;
        pagedItems: any[] = [];
        currentPage: number = 1;
        pageSize: number = 15;
        totalPages: number = 0;
        pages: number[] = [];
        //#endregion
       
          //#region filtration attributes
          searchControl = new FormControl('');
          sortControl = new FormControl('normal');// متغير للفرز: "normal" أو "reverse"
          buildingControl = new FormControl();
          selectedStatuses: string[] = [];// مصفوفة لتخزين الحالات المختارة من checkboxes
          filteredItems: any[] = [];
          //#endregion
      
          activeTab: string = 'home';
          objectData: any ;
      //#endregion
    
      private readonly dataService = inject(SharedDataService);
      private readonly _AuthService = inject(AuthService);
      private readonly router = inject(Router);
      private readonly ar = inject(ArService);
      private readonly excel = inject(ExcelService);
      private readonly dialog = inject(MatDialog);
      private readonly _BuildingsService = inject(BuildingsService)
      private destroy$ = new Subject<void>(); // Subject لتتبع التدمير
      @Output() roomAssigned = new EventEmitter<void>();


      ngOnInit(): void {

       console.log("assign row ", this.student);
      }
      ngOnChanges(changes: SimpleChanges): void {
       
        this.getFilteredBuildings()
          if (this.student?.room) {
            this.buildingId = this.student?.room?.building?.id
           }
      }
      
      getFilteredBuildings(){
        console.log("resBuildings",this.resBuildings);
        this.filteredBuildings = this.resBuildings.filter(
          (building:any) => building?.type?.toLowerCase() === this.student?.gender?.toLowerCase()
        );
        console.log("felteredBuildings",this.filteredBuildings);
      }

      RowClick(item:any): void {
        console.log("hello there this is on row click", item);
        this.router.navigate(['admin/details', item.userId]);
      }


      selectBuilding(e:any|null){
        this.resRooms = [];
        setTimeout(() => {
          const selectedValue = (e.target as HTMLSelectElement).value;
          this.buildingId = selectedValue;
          if (!this.buildingId) {
          this.resRooms = [];
          return;
          }
          this.getAvailabeRooms();
      }, 50);
      }

      getAvailabeRooms()
      {
        this._BuildingsService.getAvailableRooms(this.buildingId,'DORM').pipe(takeUntil(this.destroy$)).subscribe({
          next: (res:any) => {
            this.resRooms = res.data.filter((room:any) => room?.building?.id === +this.buildingId); // على حسب شكل الريسبونس بتاعك
            console.log("resRooms Data",res.data);
            this.resRooms = [...this.resRooms];
            console.log("resRooms",this.resRooms);
          },
          error: (err:any) => {
            console.error('Error loading rooms:', err);
          }
        });
      }



      selectRoom(e:any|null){

        const RoomId = parseInt((e.target as HTMLSelectElement).value);
        console.log("in selected Room",RoomId);
        if (!RoomId) {
          this.resRooms = [];
          return;
        }
      
        console.log("resRooms assign",this.student,RoomId);
        this._BuildingsService.assignStudentSpecificRoom(this.student?.userId,RoomId).subscribe({
          next: (res:any) => {
            console.log("resRooms assign",res);
            this.roomAssigned.emit(); // إخطار للـ parent
            this.getSpecificStudent();
          },
          error: (err:any) => {
            console.error('Error assign rooms:', err);
          }
        });
      }

      getSpecificStudent(){
        this.ar.getSpecificApplication(this.student.userId).subscribe({
          next: (response) => {
            console.log('Operation succeeded:', response);
            this.student = response?.data;
          },
          error: (err) => {
            console.error('Operation failed:', err);
            
          },
        })
      }


      removeStudentAssign()
      {
        console.log("this.removeStudentAssign call",this.student.userId,this.student.room.id);
        this._BuildingsService.removeStudentFromRoom(this.student.userId,this.student.room.id).subscribe({
          next: ()=>{
            console.log("removed success");
            this.student.room = null;
            this.buildingId = null;
            this.resRooms = [];

          },
          error: (e) =>{
            console.log("error in remove student from room", e);
          }
        })
      }


      ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    

}
