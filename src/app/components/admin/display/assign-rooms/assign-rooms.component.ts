import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedDataService } from '../../../../core/services/shared-data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ExcelService } from '../../../../core/services/excel.service';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ExportFormComponent } from '../../excel/export-form/export-form.component';
import { BuildingsService } from '../../../../core/services/buildings.service';
import { AssignRowComponent } from "../assign-row/assign-row.component";
import { ArService } from '../../../../core/services/ar.service';
import { UploadFormComponent } from '../../excel/upload-form/upload-form.component';
import { UploadAssignRoomsComponent } from '../../excel/upload-assign-rooms/upload-assign-rooms.component';
import { PaginationService } from '../../../../services/pagination.service';
import { PrivilegesDirective } from '../../../../core/directives/privileges.directive';

@Component({
  selector: 'app-assign-rooms',
  standalone: true,
  imports: [NgFor, NgIf,NgClass, FormsModule, ReactiveFormsModule, AssignRowComponent,PrivilegesDirective],
  templateUrl: './assign-rooms.component.html',
  styleUrl: './assign-rooms.component.scss'
})
export class AssignRoomsComponent {

  //#region attributes
    res: any[] = []; // البيانات الأصلية
    resBuildings: any[] = []; // البيانات الأصلية
    resRooms: any[] = []; // البيانات الأصلية
  
  
        //#region pagination attributes
      selectedAdmissionRequest: any = {};
      selectedBuilding: any = {};
      isCollapsed: boolean = true;
      pagedItems: any[] = [];
      currentPage: number = 1;
      pageSize: number = 15;
      totalPages: number = 0;
      pages: number[] = [];
      meta: any = {}; 
      //#endregion
     
          //#region filtration attributes
          searchControl = new FormControl('');
          sortControl = new FormControl('normal');// متغير للفرز: "normal" أو "reverse"
          selectedStatuses: string[] = [];// مصفوفة لتخزين الحالات المختارة من checkboxes
          selectedGenders: string[] = [];// مصفوفة لتخزين gender المختارة من checkboxes
          selectedSource: 'old' | 'new' = 'old'; // القيمة الافتراضية
          sourceData: any ;
          mixedItems: any[] = [];
          filteredItems: any[] = [];
          //#endregion
    
        activeTab: string = 'home';
        objectData: any ;
    //#endregion
  
    private readonly dataService = inject(SharedDataService);
    public readonly _AuthService = inject(AuthService)
    private readonly ar = inject(ArService);
    private readonly router = inject(Router);
    private readonly excel = inject(ExcelService);
    private readonly dialog = inject(MatDialog);
    private readonly pagination = inject(PaginationService);
    private readonly _BuildingsService = inject(BuildingsService)
    private destroy$ = new Subject<void>(); // Subject لتتبع التدمير
    autoAssignBtn: boolean = true;
  displayedPages: number[] = [];
  filters: { filters?: any; offset?: number | undefined; } | undefined;
  currentPagesArray: number[] = [];
  myFilters: any;
  selectedStudentTypes: any[] =[];
    constructor() {
      this.dataService.currentStudentData.pipe(takeUntil(this.destroy$)).subscribe(data => {
        console.log('Received data:', data);
        this.selectedAdmissionRequest = data; 

        // this.dataService.currentBuildingData.pipe(takeUntil(this.destroy$)).subscribe(data => {
        //   console.log('building data:', data);
        //   this.selectedBuilding = data; 
        // });
      });
    }


    

    selectBuilding(e:any|null){

      console.log("in selected building",e.value);
      const buildingId = e.value;
      if (!buildingId) {
        this.resRooms = [];
        return;
      }
    
      this._BuildingsService.getAvailableRooms(buildingId,'DORM').subscribe({
        next: (res:any) => {
          this.resRooms = res.data; // على حسب شكل الريسبونس بتاعك
          console.log("resRooms",this.resRooms);
        },
        error: (err:any) => {
          console.error('Error loading rooms:', err);
        }
      });
    }
  
  
    ngOnInit(): void {
      this.myFilters = {status:'ACCEPTED'};
     this.getApplications({'filters':this.myFilters,'offset':this.currentPage-1});
     this.updateDisplayedPages();

      // الاشتراك في تغييرات حقل البحث باستخدام Reactive Form مع debounceTime
      this.searchControl.valueChanges.pipe(
        debounceTime(1000)
      ).subscribe(() => {
        this.applyFilters();
      });
      this.sortControl.valueChanges.pipe(
        debounceTime(300)
      ).subscribe(() => {
        this.applyFilters();
      });
    }

    getApplications({ filters, offset }: { filters?: any, offset?: number } = {})
    {
       this.ar.getApplications(filters,offset).subscribe({
        next: (res: any) => {
          this.getBuildings();
          console.log(res);
          this.sourceData = res.data;
          // this.mixedItems = [ ...res.data.oldStudents, ...res.data.newStudents ];
          this.res = res.data;
          this.filteredItems = this.res;
          console.log(this.res);
          this.meta = res.meta;
          console.log(this.meta);
          this.initPagination();
          // this.applyFilters();

        },
        error: (err:any) => { console.log(err); },
      });
    }

      
    onSourceChange(): void {
      if (this.selectedSource === 'old')
      {
        this.res = [ ...this.sourceData.oldStudents ];
      } 
      else if (this.selectedSource === 'new') 
      {
        this.res = [ ...this.sourceData.newStudents ];
      }
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

    //#region pagination methods
    initPagination(): void {
      this.totalPages = this.meta?.totalPages;
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.currentPagesArray = this.pagination.getDisplayedPages(this.totalPages, this.currentPage);
       this.updateDisplayedPages();
    }
  
    changePage(page: number): void {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.updateDisplayedPages(); // تحديث الصفحات المعروضة
      if(this.sortControl.value === 'normal') 
        this.getApplications({'filters':this.myFilters,'offset':this.currentPage-1});
      else
      {
        this.getApplications({'filters':this.myFilters,'offset':this.totalPages-this.currentPage});
      }
    }
  
    getDisplayedPages(): number[] {
      console.log(this.pagination.getDisplayedPages(this.totalPages, this.currentPage));
      return this.currentPagesArray;
    }

    updateDisplayedPages(): void {
        // شيك لو إجمالي الصفحات صفر
              console.log(this.totalPages); // هيتنفذ مرة واحدة بس وقت التحديث

  if (!this.totalPages) {
    this.displayedPages = [];
      console.log(this.displayedPages); // هيتنفذ مرة واحدة بس وقت التحديث
      return;
  }
  this.displayedPages = this.pagination.getDisplayedPages(this.totalPages, this.currentPage);
  console.log(this.displayedPages); // هيتنفذ مرة واحدة بس وقت التحديث
  }

    //#endregion
  
    handleClick(student: any): void {
      console.log(student);
      this.dataService.changeStudentData(student);
    }

  
    RowClick(item:any): void {
      console.log("hello there this is on row click", item);
      this.handleClick(item);
      this.router.navigate(['admin/details', item.userId]);
    }
  
    // دالة لتحديث selectedStatuses عند تغيير حالة checkbox
    onStatusChange(event: any): void {
      const checked = event.target.checked;
      const value = event.target.value;
      if (checked) {
        this.selectedStatuses.push(value);
        console.log("this.selectedStatuses",this.selectedStatuses);
      } else {
        this.selectedStatuses = this.selectedStatuses.filter(status => status !== value);
        console.log("this.selectedStatuses",this.selectedStatuses);
  
      }
      this.applyFilters();
    }


    // Updated change handler
onGenderChange(event: any): void {
  const checked = event.target.checked;
  const value = event.target.value;
  if (checked) {
    this.selectedGenders.push(value);
  } else {
    this.selectedGenders = this.selectedGenders.filter(gender => gender !== value);
  }
  this.applyFilters();
}

    
  
    // دالة لتطبيق الفلاتر (البحث وحالة الـ checkboxes)
    applyFilters(): void {

       // تطبيق فلترة البحث
      const searchText = this.searchControl.value;
      if (searchText) {
         this.myFilters = {
          ...this.myFilters,        
          search: searchText, 
        };
      }
      if(!searchText){
        // إزالة الفلتر عند عدم وجود حالات مختارة
        if (this.myFilters?.search) {
          delete this.myFilters.search;
        }
      }
    

      // Student Type filter
      if (this.selectedStudentTypes.length === 1) {
          this.myFilters = {
            ...this.myFilters,
            studentType: this.selectedStudentTypes.join(','),
          };
      } else {
            if (this.myFilters?.studentType || this.selectedStudentTypes.length === 2) {
              delete this.myFilters.studentType;
            }
      }

      this.getApplications({'filters':this.myFilters,'offset':this.currentPage-1}); 
      
    }

          onStudentTypeChange(event: any): void {
  const value = event.target.value;

  this.selectedStudentTypes = [value];

  this.applyFilters();
}


       openUploadDialog():void{
          const dialogRef = this.dialog.open(UploadAssignRoomsComponent, {
            width: '50%', // Set the width of the dialog
            
            // panelClass: 'custom-dialog-container'
    
          });
      
          dialogRef.afterClosed().subscribe((result:any) => {
            this.getApplications({'filters':this.myFilters,'offset':this.currentPage-1});
            if (result) {
              // this.getDeadLine(); // Refresh the list after the dialog is closed
            }
          });
        }
    
        // openDialog(): void {
        //     const dialogRef = this.dialog.open(ExportFormComponent, {
        //       width: '50%', // Set the width of the dialog
        //       panelClass: 'custom-dialog-container'
    
        //     });
        
        //     dialogRef.afterClosed().subscribe((result:any) => {
        //       if (result) {
        //         // this.getDeadLine(); // Refresh the list after the dialog is closed
        //       }
        //     });
        //   }
  
        
        autoAssignRoom(item: any): void {
          this._BuildingsService.autoAssignRoom(item.userId, "DORM").subscribe({
            next: (res: any) => {
              this.getApplications({'filters':this.myFilters,'offset':this.currentPage-1}); 
              console.log(res);
            },
            error: (err: any) => {
              console.error(err);
            }
          });
        }

        onRoomAssigned(item: any): void {
          this.getApplications({'filters':this.myFilters,'offset':this.currentPage-1});
        }
 


    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }


}
