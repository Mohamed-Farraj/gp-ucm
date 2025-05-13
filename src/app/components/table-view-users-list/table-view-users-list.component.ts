import { Component, inject, signal } from '@angular/core';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SharedDataService } from '../../core/services/shared-data.service';
import { AuthService } from '../../core/services/auth.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ExcelService } from '../../core/services/excel.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddDeadlineComponent } from '../add-deadline/add-deadline.component';
import { ExportFormComponent } from '../export-form/export-form.component';
import Swal from 'sweetalert2';
import { UploadFormComponent } from '../upload-form/upload-form.component';
import { ArService } from '../../core/services/ar.service';
import { UploadStatusComponent } from '../upload-status/upload-status.component';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-table-view-users-list',
  standalone: true,
  imports: [ReactiveFormsModule,NgFor,MatDialogModule,NgIf,FormsModule,NgClass],
  templateUrl: './table-view-users-list.component.html',
  styleUrl: './table-view-users-list.component.scss'
})
export class TableViewUsersListComponent {

  //#region attributes
    res: any[] = []; // البيانات الأصلية
    isCollapsed: boolean = true;
  
  
      //#region pagination attributes
      selectedAdmissionRequest: any = {};
      pagedItems: any[] = [];
      currentPage: number = 1;
      pageSize: number = 20;
      totalPages: number = 0;
      pages: number[] = [];
      currentPagesArray:number[] = [];
      meta: any = {};
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
    private destroy$ = new Subject<void>(); // Subject لتتبع التدمير
  
    constructor() {
      this.dataService.currentStudentData.pipe(takeUntil(this.destroy$)).subscribe(data => {
        console.log('Received data:', data);
        this.selectedAdmissionRequest = data; 
      });
    }
  
  
    ngOnInit(): void {
      this.getApplication();


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
          this.res = res.data;
          this.meta = res.meta;
          this.filteredItems = this.res;
          console.log(this.res);
        if(this.sortControl.value === 'reverse')
          this.res = [...this.res.reverse()];
          this.initPagination();
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
        this.getApplication();
      } else if (this.selectedSource === 'sorted') {
        this.getSortedApplications();
      }
    }
   



    //#region pagination methods
    initPagination(): void {
      this.totalPages = this.meta.totalPages;
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.currentPagesArray = this.pagination.getDisplayedPages(this.totalPages, this.currentPage);
    }
  
    changePage(page: number): void {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
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
    //#endregion
  




      Toast = Swal.mixin({
        toast: true,
        position: 'top',
        iconColor: 'white',
        customClass: {
          popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })

      confirmation(id: number = -1, status: string = 'UNDER_REVIEW', item?: any) {
        const procedure = status === 'ACCEPTED' ? 'قبول' : 
                         (status === 'UNDER_REVIEW' ? 'مراجعة' : 'رفض');
        
        const commonSwalConfig = {
            title: "هل انت متأكد؟",
            icon: "warning" as const,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "الغاء",
            allowOutsideClick: () => !Swal.isLoading()
        };
    
        if (status === 'REJECTED') {
            Swal.fire({
                ...commonSwalConfig,
                title: "ادخل سبب رفض هذا الطلب",
                input: "text",
                inputAttributes: {
                    autocapitalize: "off"
                },
                confirmButtonText: `${procedure} هذا الطلب؟`,
                preConfirm: (reason) => {
                    if (!reason) {
                        Swal.showValidationMessage('يجب ادخال سبب الرفض');
                        return false;
                    }
                    return reason;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                  console.log("thats a rejection reason",result.value);
                    this.DecideAr(id, status, item,result.value);
                }
            });
        } else {
            Swal.fire({
                ...commonSwalConfig,
                confirmButtonText: `${procedure} هذا الطلب؟`,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.DecideAr(id, status, item);
                }
            });
        }
    }

      getLevel(level:string){
        if(level.includes('first'))
        {
          return '1'
        }
        else if(level.includes('second'))
        {
          return '2'
        }
        else if(level.toLowerCase().includes('third'))
        {
          return '3'
        }
        else if(level.includes('fourth'))
        {
          return '4'
        }
        else if(level.includes('fifth'))
        {
          return '5'
        }
        else
        {
          return level
        }
      }
  
    DecideAr(id:number = -1,status:string = 'UNDER_REVIEW',item?:any, message?:string) {
      if (id === -1) 
        {
          this.Toast.fire({
          icon: 'error',
          title: 'حدث خطأ في اختيار رقم المستخدم',
        })   
        }
        else{
    
          this._AuthService.DecideArState(id, status,message ).subscribe({
            next: (response) => {
              console.log('Operation succeeded:', response);
              item.status = status;
              if (status === 'UNDER_REVIEW' ) {
                this.Toast.fire({
                  icon: 'success',
                  title: 'هذا الطلب تحت المراجعة',
                })   
              }
              
              else if (status === 'ACCEPTED' ) {
                this.Toast.fire({
                  icon: 'success',
                  title: 'قد تم قبول الطلب بنجاح',
                })   
              }
              else if (status === 'REJECTED' ) {
                this.Toast.fire({
                  icon: 'success',
                  title: 'قد تم رفض الطلب بنجاح',
                })   
              }
            },
            error: (err) => {
              console.error('Operation failed:', err);
              this.Toast.fire({
                icon: 'error',
                title: err.error.message,
              })   
            },
          });
        }
    }
    
    handleClick(student: any): void {
      console.log(student);
      this.dataService.changeStudentData(student);
    }
  
    RowClick(item:any): void {
      console.log("hello there this is on row click", item);
      this.handleClick(item);
      this.router.navigate(['admin/details', item.userId]);
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
 
  
  
       // تطبيق الفرز: استخدام نسخة من المصفوفة لعكس الترتيب لتجنب التعديل على المصفوفة الأصلية
       const sortOption = this.sortControl.value;
       let actualOffset = (this.currentPage - 1);
       if (sortOption === 'reverse') {
        this.getApplication({filters: this.myFilters, offset: this.totalPages-actualOffset-1});
        return;
       }


   
      this.getApplication({filters: this.myFilters, offset: this.currentPage - 1});
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

    uploadFile() {

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
          this.getApplication();
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
          this.getApplication();
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
