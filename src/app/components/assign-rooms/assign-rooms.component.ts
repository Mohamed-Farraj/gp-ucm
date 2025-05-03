import { NgFor, NgIf } from '@angular/common';
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

@Component({
  selector: 'app-assign-rooms',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule, AssignRowComponent],
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
      //#endregion
     
          //#region filtration attributes
          searchControl = new FormControl('');
          sortControl = new FormControl('normal');// متغير للفرز: "normal" أو "reverse"
          selectedStatuses: string[] = [];// مصفوفة لتخزين الحالات المختارة من checkboxes
          selectedGenders: string[] = [];// مصفوفة لتخزين gender المختارة من checkboxes
          filteredItems: any[] = [];
          //#endregion
    
        activeTab: string = 'home';
        objectData: any ;
    //#endregion
  
    private readonly dataService = inject(SharedDataService);
    private readonly _AuthService = inject(AuthService);
    private readonly ar = inject(ArService);
    private readonly router = inject(Router);
    private readonly excel = inject(ExcelService);
    private readonly dialog = inject(MatDialog);
    private readonly _BuildingsService = inject(BuildingsService)
    private destroy$ = new Subject<void>(); // Subject لتتبع التدمير
  
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
      this.ar.getApplications({ status: 'ACCEPTED',securityCheck:'ACCEPTED',hasPenalty:'false' }).subscribe({
        next: (res: any) => {
          this.getBuildings();
          console.log(res);
          this.res = res.data;
          this.filteredItems = this.res;
          console.log(this.res);
          this.initPagination();
          this.applyFilters();

        },
        error: (err:any) => { console.log(err); },
      });
  
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
      this.totalPages = Math.ceil(this.res.length / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updatePagedItems();
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
      this.updatePagedItems();
    }
  
    // دالة لحساب الصفحات للعرض (اختياري)
    getDisplayedPages(): number[] {
      const totalPages = this.totalPages;
      const currentPage = this.currentPage;
      let startPage: number, endPage: number;
      
      if (totalPages <= 5) {
        startPage = 1;
        endPage = totalPages;
      } else {
        if (currentPage <= 3) {
          startPage = 1;
          endPage = 5;
        } else if (currentPage + 2 >= totalPages) {
          startPage = totalPages - 4;
          endPage = totalPages;
        } else {
          startPage = currentPage - 2;
          endPage = currentPage + 2;
        }
      }
      
      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
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
      let filtered = this.res; // البيانات الأصلية
    
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
    
      // تطبيق فلترة الـ checkbox لحالة status
      if (this.selectedStatuses.length > 0) {
        filtered = filtered.filter((item: any) => this.selectedStatuses.includes(item.status));
      }
    
      // Gender filter
  if (this.selectedGenders.length > 0) {
    filtered = filtered.filter((item: any) => 
      this.selectedGenders.includes(item.gender)
    );
  }
  
  
       // تطبيق الفرز: استخدام نسخة من المصفوفة لعكس الترتيب لتجنب التعديل على المصفوفة الأصلية
       const sortOption = this.sortControl.value;
       if (sortOption === 'reverse') {
         filtered = [...filtered].reverse(); // Create a new array to avoid mutation issues
       }
      // احفظ النتيجة المفلترة في this.filteredItems
  
      this.filteredItems = filtered;
    
      // إعادة تعيين Pagination بناءً على النتائج المفلترة
      this.currentPage = 1;
      this.totalPages = Math.ceil(filtered.length / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updatePagedItems();
    }



       openUploadDialog():void{
          const dialogRef = this.dialog.open(UploadFormComponent, {
            width: '50%', // Set the width of the dialog
            
            // panelClass: 'custom-dialog-container'
    
          });
      
          dialogRef.afterClosed().subscribe((result:any) => {
            if (result) {
              // this.getDeadLine(); // Refresh the list after the dialog is closed
            }
          });
        }
    
        openDialog(): void {
            const dialogRef = this.dialog.open(ExportFormComponent, {
              width: '50%', // Set the width of the dialog
              panelClass: 'custom-dialog-container'
    
            });
        
            dialogRef.afterClosed().subscribe((result:any) => {
              if (result) {
                // this.getDeadLine(); // Refresh the list after the dialog is closed
              }
            });
          }
  
   
    // removeSelection()
    // {
    //   this.dataService.changeStudentData(null);
  
    // }

    // deleteAr(id:number,id2:number)
    // {
    //     console.log("this is delete button");
    // }
  
    //  downloadFile() {
    //   this.excel.exportAdmissionRequests('ALL','ALL')
    //     .subscribe({
    //       next: (blob: Blob) => {
    //         // إنشاء ملف قابل للتحميل
    //         const a = document.createElement('a');
    //         const objectUrl = URL.createObjectURL(blob);
    //         a.href = objectUrl;
    //         a.download = 'admission_requests.xlsx'; // تحديد اسم الملف
    //         a.click();
    //         URL.revokeObjectURL(objectUrl);
    //       },
    //       error: (err:any) => {
    //         console.error('فشل التحميل:', err);
    //         // يمكنك إضافة معالجة الأخطاء هنا
    //       }
    //     });
    //  }

    // openDialog(): void {
    //     const dialogRef = this.dialog.open(ExportFormComponent, {
    //       width: '50%', // Set the width of the dialog
    //     });
    
    //     dialogRef.afterClosed().subscribe((result:any) => {
    //       if (result) {
    //         // this.getDeadLine(); // Refresh the list after the dialog is closed
    //       }
    //     });
    //   }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }


}
