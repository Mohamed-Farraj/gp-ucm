import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedDataService } from '../../core/services/shared-data.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ExcelService } from '../../core/services/excel.service';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ExportFormComponent } from '../export-form/export-form.component';
import { BuildingsService } from '../../core/services/buildings.service';
import { AssignRowComponent } from "../assign-row/assign-row.component";
import { ArService } from '../../core/services/ar.service';
import { UploadFormComponent } from '../upload-form/upload-form.component';
import { UploadAssignRoomsComponent } from '../upload-assign-rooms/upload-assign-rooms.component';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-assign-rooms',
  standalone: true,
  imports: [NgFor, NgIf,NgClass, FormsModule, ReactiveFormsModule, AssignRowComponent],
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
     this.getApplications();
  
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

    getApplications(offset?: number)
    {
       this.ar.getSortedApplications().subscribe({
        next: (res: any) => {
          this.getBuildings();
          console.log(res);
          this.sourceData = res.data;
          this.mixedItems = [ ...res.data.oldStudents, ...res.data.newStudents ];
          this.res = [ ...res.data.oldStudents ];
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
      this.totalPages = this.meta.totalPages;
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      console.log('totalPages',this.pages);
    }
  
    // دالة لتحديث العناصر المعروضة حسب الصفحة الحالية
    updatePagedItems(): void {
      const start = (this.currentPage - 1) * this.pageSize;
      // استخدم المصفوفة المفلترة لو موجودة، وإلا استخدم this.res
      const dataToPaginate = this.filteredItems ? this.filteredItems : this.res;
      this.pagedItems = dataToPaginate.slice(start, start + this.pageSize);
    }
    
  
    // تغيير الصفحة عند الضغط على رقم الصفحة أو Previous/Next
    changePage(page: number): void {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.getApplications(this.currentPage-1);
    }
  
    // دالة لحساب الصفحات للعرض (اختياري)
    getDisplayedPages(): number[] {
      console.log(this.pagination.getDisplayedPages(this.totalPages, this.currentPage));
      return this.pagination.getDisplayedPages(this.totalPages, this.currentPage);
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
      let filtered = this.mixedItems; // البيانات الأصلية

      // لو مفيش ولا فلتر متطبق (لا بحث ولا جندر)، ارجع للسورس فقط
  if (!this.searchControl.value && this.selectedGenders.length === 0) {
      filtered = this.selectedSource === 'old' 
      ? [...this.sourceData.oldStudents] 
      : [...this.sourceData.newStudents];
  } else 
  // لو في فلاتر مفعّلة، فلتر من mixedItems
  filtered = [...this.mixedItems];
    
      // تطبيق فلترة البحث
      const searchText = this.searchControl.value;
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        filtered = filtered.filter((item: any) =>
          (item.firstName && item.firstName.toLowerCase().includes(searchLower)) ||
          (item.lastName && item.lastName.toLowerCase().includes(searchLower)) ||
          (item.nationalId && item.nationalId.toLowerCase().includes(searchLower))
        );
      }
    

      // Gender filter
  if (this.selectedGenders.length > 0) {
    filtered = filtered.filter((item: any) => 
      this.selectedGenders.includes(item.gender)
    );
  }
  

  
      this.res = [...filtered];
    
      // إعادة تعيين Pagination بناءً على النتائج المفلترة
      this.currentPage = 1;
      this.totalPages = Math.ceil(filtered.length / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updatePagedItems();
    }



       openUploadDialog():void{
          const dialogRef = this.dialog.open(UploadAssignRoomsComponent, {
            width: '50%', // Set the width of the dialog
            
            // panelClass: 'custom-dialog-container'
    
          });
      
          dialogRef.afterClosed().subscribe((result:any) => {
            this.getApplications();
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
              this.getApplications();
              console.log(res);
            },
            error: (err: any) => {
              console.error(err);
            }
          });
        }

        onRoomAssigned(item: any): void {
          this.getApplications();
        }
 

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }


}
