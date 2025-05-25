import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedDataService } from '../../../../core/services/shared-data.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-users-side-list',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass,NgFor],
  templateUrl: './users-side-list.component.html',
  styleUrl: './users-side-list.component.scss'
})
export class UsersSideListComponent {
  //#region attributes
  res: any[] = []; // البيانات الأصلية


      //#region pagination attributes
    selectedAdmissionRequest: any = {};
    isCollapsed: boolean = true;
    pagedItems: any[] = [];
    currentPage: number = 1;
    pageSize: number = 10;
    totalPages: number = 0;
    pages: number[] = [];
    meta: any = {}; 
    //#endregion
   
      //#region filtration attributes
      searchControl = new FormControl('');
      sortControl = new FormControl('normal');// متغير للفرز: "normal" أو "reverse"
      selectedStatuses: string[] = [];// مصفوفة لتخزين الحالات المختارة من checkboxes
      filteredItems: any[] = [];
      //#endregion
  
      activeTab: string = 'home';
      objectData: any ;
  //#endregion

  private readonly dataService = inject(SharedDataService);
  private readonly _AuthService = inject(AuthService);
  private destroy$ = new Subject<void>(); // Subject لتتبع التدمير

  constructor() {
    this.dataService.currentStudentData.pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('Received data:', data);
      this.selectedAdmissionRequest = data; 
    });
  }


  ngOnInit(): void {
    this.removeSelection()
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


  
  getApplication(offset?: number) {


    this._AuthService.getApplications(offset).subscribe({
      next: (res: any) => {
       
        console.log(res);
        this.res = res.data;
        this.meta = res.meta;
        this.filteredItems = this.res;
        console.log(this.res);
        this.initPagination();
      },
      error: (err:any) => { console.log(err); },
    });

    

  }

    //#region pagination methods
    initPagination(): void {
      this.totalPages = this.meta.totalPages;
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
  
    // دالة لتحديث العناصر المعروضة حسب الصفحة الحالية
    // updatePagedItems(): void {
    //   const start = (this.currentPage - 1) * this.pageSize;
    //   // استخدم المصفوفة المفلترة لو موجودة، وإلا استخدم this.res
    //   const dataToPaginate = this.filteredItems ? this.filteredItems : this.res;
    //   this.pagedItems = dataToPaginate.slice(start, start + this.pageSize);
    // }
    
  
    // تغيير الصفحة عند الضغط على رقم الصفحة أو Previous/Next
    
    changePage(page: number): void {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.getApplication(this.currentPage-1);
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
      filtered = filtered.filter((item: any) => this.selectedStatuses.includes(item.status));
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
  }

 
  removeSelection()
  {
    this.dataService.changeStudentData(null);

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
