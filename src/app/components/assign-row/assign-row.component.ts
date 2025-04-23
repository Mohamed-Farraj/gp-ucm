import { Component, inject, input, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BuildingsService } from '../../core/services/buildings.service';
import { ExcelService } from '../../core/services/excel.service';
import { SharedDataService } from '../../core/services/shared-data.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-assign-row',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './assign-row.component.html',
  styleUrl: './assign-row.component.scss'
})
export class AssignRowComponent {

  //#region attributes
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
      private readonly excel = inject(ExcelService);
      private readonly dialog = inject(MatDialog);
      private readonly _BuildingsService = inject(BuildingsService)
      private destroy$ = new Subject<void>(); // Subject لتتبع التدمير
      

      ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
       
      }
      ngOnChanges(changes: SimpleChanges): void {
        console.log("resBuildings",this.resBuildings);
          this.filteredBuildings = this.resBuildings.filter(
            (building:any) => building?.type?.toLowerCase() === this.student?.gender?.toLowerCase()
          );
          console.log("felteredBuildings",this.filteredBuildings);
      }
      filteredBuildings: any[] = [];
      buildingId:any;

      RowClick(item:any): void {
        console.log("hello there this is on row click", item);
        this.handleClick(item);
        this.router.navigate(['admin/details', item.userId]);
      }

      handleClick(student: any): void {
        console.log(student);
        this.dataService.changeStudentData(student);
      }

      selectBuilding(e:any|null){

        console.log("in selected building",e.value);
         this.buildingId = e.value;
        if (!this.buildingId) {
          this.resRooms = [];
          return;
        }
      
        this._BuildingsService.getAvailableRooms(this.buildingId,'DORM').subscribe({
          next: (res:any) => {
            this.resRooms = res.data; // على حسب شكل الريسبونس بتاعك
            console.log("resRooms",this.resRooms);
          },
          error: (err:any) => {
            console.error('Error loading rooms:', err);
          }
        });
      }
      selectRoom(e:any|null){

        console.log("in selected Room",e.value);
        const RoomId = e.value;
        if (!RoomId) {
          this.resRooms = [];
          return;
        }
      
        console.log("resRooms assign",this.student,JSON.parse(RoomId));
        this._BuildingsService.assignStudentSpecificRoom(this.student?.userId,JSON.parse(RoomId)).subscribe({
          next: (res:any) => {
            console.log("resRooms assign",res);
          },
          error: (err:any) => {
            console.error('Error assign rooms:', err);
          }
        });
      }

      
    

      getBuildings(): void {
        this._BuildingsService.getAllBuildings(1).subscribe({
          next: (res: any) => {
           
            console.log('building result',res);
            this.resBuildings = res.data;
            this.filteredItems = this.res;
            console.log(this.res);
          },
          error: (err) => { console.log(err); },
        });
      }
}
