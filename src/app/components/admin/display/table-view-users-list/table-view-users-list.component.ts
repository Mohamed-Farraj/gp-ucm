import { PrivilegesService } from './../../../../core/services/privileges.service';
import { Component, inject, signal } from '@angular/core';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SharedDataService } from '../../../../core/services/shared-data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ExcelService } from '../../../../core/services/excel.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddDeadlineComponent } from '../../forms/add-deadline/add-deadline.component';
import { ExportFormComponent } from '../../excel/export-form/export-form.component';
import Swal from 'sweetalert2';
import { UploadFormComponent } from '../../excel/upload-form/upload-form.component';
import { ArService } from '../../../../core/services/ar.service';
import { UploadStatusComponent } from '../../excel/upload-status/upload-status.component';
import { PaginationService } from '../../../../services/pagination.service';
import { ArTableComponent } from "../ar-table/ar-table.component";
import { PrivilegesDirective } from '../../../../core/directives/privileges.directive';
import { PrivilagesService } from '../../../../core/services/privilages.service';

@Component({
  selector: 'app-table-view-users-list',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, MatDialogModule, NgIf, FormsModule, NgClass, ArTableComponent , PrivilegesDirective],
  templateUrl: './table-view-users-list.component.html',
  styleUrl: './table-view-users-list.component.scss'
})
export class TableViewUsersListComponent {

  //#region attributes
    res: any[] = []; // البيانات الأصلية
    isCollapsed: boolean = true;
  
  
      //#region pagination attributes
      selectedAdmissionRequest: any = {};
      // pagedItems: any[] = [];
      currentPage: number = 1;
      pageSize: number = 20;
      totalPages: number = 0;
      pages: number[] = [];
      currentPagesArray:number[] = [];
      meta: any = {};
      displayedPages: number[] = [];
      //#endregion
     
        //#region filtration attributes
        searchControl = new FormControl('');
        sortControl = new FormControl('normal');// متغير للفرز: "normal" أو "reverse"
        selectedStatuses: string[] = [];// مصفوفة لتخزين الحالات المختارة من checkboxes
        selectedGenders: string[] = [];// مصفوفة لتخزين gender المختارة من checkboxes
        filteredItems: any[] = [];
        sortedApplications: any[] = [];
        selectedSource: 'all' | 'sorted' = 'all'; // القيمة الافتراضية
        myFilters: any = {};
        selectedStudentTypes: string[] = []; // لتخزين الأنواع المختارة

        //#endregion
        
        activeTab: string = 'home';
        objectData: any ;
    //#endregion
  
    private readonly dataService = inject(SharedDataService);
    public readonly _AuthService = inject(AuthService);
    private readonly ar = inject(ArService);
    private readonly router = inject(Router);
    private readonly excel = inject(ExcelService);
    private readonly dialog = inject(MatDialog);
    private readonly pagination = inject(PaginationService);
    private readonly _Privileges = inject(PrivilagesService); 
    private destroy$ = new Subject<void>(); // Subject لتتبع التدمير
  
    constructor() {
      this.dataService.currentStudentData.pipe(takeUntil(this.destroy$)).subscribe(data => {
        console.log('Received data:', data);
        this.selectedAdmissionRequest = data; 
      });
    }
  
  
    ngOnInit(): void {


      this.getApplication();
      // this._Privileges.setPrivileges();

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


    getApplication({ filters, offset }: { filters?: any, offset?: number } = {}) {
      console.log("this is getApplication",offset);

      this.ar.getApplications(filters,offset).subscribe({
        next: (res: any) => {
         
          console.log(res);
          this.res = res?.data;
          this.meta = res?.meta;
          this.filteredItems = this.res;
          console.log(this.res);
        if(this.sortControl.value === 'reverse')
          this.res = [...this.res.reverse()];
          this.initPagination();
          this.updateDisplayedPages();
        },
        error: (err:any) => { console.log(err); },
      });
    }


    getSortedApplications(){
      let returned : any;
      this.ar.getSortedApplications().subscribe({
        next: (res: any) => {
          console.log(res);
          this.res = [...res.data.oldStudents, ...res.data.newStudents];
          this.applyFilters();
        },
        error:(err:any)=>{console.log(err);return returned;}
      })      
    }
  
    onSourceChange(): void {
      if (this.selectedSource === 'all') {
        this.currentPage = 1;
        this.applyFilters();
      } else if (this.selectedSource === 'sorted') {
          this.currentPage = 1;
          this.selectedStudentTypes = ['old'];
          this.onStudentTypeChange({ target: { value: 'old', checked: true } });
          this.applyFilters();
      }
    }

    //#region pagination methods
    initPagination(): void {
      this.totalPages = this.meta?.totalPages;
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.currentPagesArray = this.pagination.getDisplayedPages(this.totalPages, this.currentPage);
    }
  
    changePage(page: number): void {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.updateDisplayedPages(); // تحديث الصفحات المعروضة
      if(this.sortControl.value === 'normal') 
        this.getApplication({'filters':this.myFilters,'offset':this.currentPage-1});
      else
      {
        this.getApplication({'filters':this.myFilters,'offset':this.totalPages-this.currentPage});
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

       onStudentTypeChange(event: any): void {
  const value = event.target.value;

  // بما إن الراديو دايمًا بيكون واحد بس
  this.selectedStudentTypes = [value];

  this.applyFilters();
}


  
    // دالة لتطبيق الفلاتر (البحث وحالة الـ checkboxes)
    applyFilters(): void {
      let filtered = this.res; // البيانات الأصلية
    
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
    
      // تطبيق فلترة الـ checkbox لحالة status
      if (this.selectedStatuses.length > 0) {
        this.myFilters = {
          ...this.myFilters,        
          status: this.selectedStatuses.join(','), 
        };
        
      }else {
        // إزالة الفلتر عند عدم وجود حالات مختارة
        if (this.myFilters?.status) {
          delete this.myFilters.status;
        }
      }
      
      // Gender filter
      if (this.selectedGenders.length == 1) {
        this.myFilters = {
          ...this.myFilters,        
          gender: this.selectedGenders.join(','), 
        };
      }else{ 
        // إزالة الفلتر عند عدم وجود حالات مختارة
        if (this.myFilters?.gender) {
          delete this.myFilters.gender;
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

 
  
  
       // تطبيق الفرز: استخدام نسخة من المصفوفة لعكس الترتيب لتجنب التعديل على المصفوفة الأصلية
       const sortOption = this.sortControl.value;
       let actualOffset = (this.currentPage - 1);
       if (sortOption === 'reverse') {
        this.getApplication({filters: this.myFilters, offset: this.totalPages-actualOffset-1});
        return;
       }


       if(this.selectedSource == "all")
       {
         delete this.myFilters.isSorted;
         this.getApplication({filters: this.myFilters, offset: this.currentPage - 1});
       }
      else if(this.selectedSource == "sorted")
      {
            
          // نضيف isSorted=true لو sorted
          this.myFilters = {
            ...this.myFilters,
            isSorted: true,
          };
          this.getApplication({
            filters: this.myFilters,
            offset:  this.currentPage -1,
          });
      }

    
    }
  
 
    downloadSorted()
    {
      this.excel.downloadSorted().subscribe({
        next: (blob: Blob) => {
          // إنشاء ملف قابل للتحميل
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = 'sorted.xlsx'; // تحديد اسم الملف
          a.click();
          URL.revokeObjectURL(objectUrl);
        },
        error: (err:any) => {
          console.error('فشل التحميل:', err);
          // يمكنك إضافة معالجة الأخطاء هنا
        }
      })
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

      dialogRef.afterClosed().subscribe((result:any) => {
        console.log("result",result);
        if (result) {
          this.getApplication({
            filters: this.myFilters,
            offset:  this.currentPage -1,
          });
        }
      });

      
    }

    openUploadStatusDialog():void{
      const dialogRef = this.dialog.open(UploadStatusComponent, {
        width: '50%', // Set the width of the dialog
        
        // panelClass: 'custom-dialog-container'

      });
  

      dialogRef.afterClosed().subscribe((result:any) => {
        console.log("result",result);
        if (result) {
          this.getApplication({
            filters: this.myFilters,
            offset:  this.currentPage -1,
          });
        }
      });

      
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(ExportFormComponent, {
          width: '50%', // Set the width of the dialog
          // panelClass: 'custom-dialog-container'

        });
    
      
      }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

}
