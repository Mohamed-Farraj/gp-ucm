import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedDataService } from '../../../../core/services/shared-data.service';
import { BuildingsService } from '../../../../core/services/buildings.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { NgClass, NgFor } from '@angular/common';
import { SearchPipe } from '../../../../core/pipes/search.pipe';
import { MatDialog } from '@angular/material/dialog';
import { Ibuilding } from '../../../../core/interfaces/ibuilding';
import { AddBuildingComponent } from '../../forms/add-building/add-building.component';

@Component({
  selector: 'app-buildings-list',
  standalone: true,
  imports: [NgClass,ReactiveFormsModule,NgFor,SearchPipe,FormsModule],
  templateUrl: './buildings-list.component.html',
  styleUrl: './buildings-list.component.scss'
})
export class BuildingsListComponent {


  //#region attributes
    res: any[] = []; // البيانات الأصلية

  
        //#region pagination attributes
      selectedBuilding: any = {};
      isCollapsed: boolean = true;
      pagedItems: any[] = [];
      currentPage: number = 1;
      pageSize: number = 7;
      totalPages: number = 0;
      pages: number[] = [];
      //#endregion
     
        //#region filtration attributes
        searchControl = new FormControl('');
        sortControl = new FormControl('normal');// متغير للفرز: "normal" أو "reverse"
        selectedStatuses: string[] = [];// مصفوفة لتخزين الحالات المختارة من checkboxes
        filteredItems: any[] = [];
        myModel:string = "";
        //#endregion
    
        activeTab: string = 'buildings';
        objectData: any ;
    //#endregion
    private destroy$ = new Subject<void>(); // Subject لتتبع التدمير
    private readonly dataService = inject(SharedDataService);
    private readonly _BuildingsService = inject(BuildingsService);

    constructor() {
      this.dataService.currentBuildingData.pipe(takeUntil(this.destroy$)).subscribe(data => {
        console.log('building data:', data);
        this.selectedBuilding = data; 
      });
    }

    getBuildings(uid:number = 1): void {
      this._BuildingsService.getAllBuildings(uid).subscribe({
        next: (res: any) => {
         
          console.log('building result',res);
          this.res = res.data;
          this.filteredItems = this.res;
          console.log(this.res);
          this.initPagination();
        },
        error: (err) => 
          {
           console.log(err);
           // 🧹 تنظيف البيانات القديمة
      this.res = [];
      this.filteredItems = [];
      this.pagedItems = [];
      this.currentPage = 1;
      this.totalPages = 0;
      this.pages = [];

      // 👀 ممكن كمان تعرض رسالة للمستخدم
      // alert('لم يتم العثور على بيانات للمباني');
           },
      });
    }
  

    ngOnInit(): void {
     
      this.getBuildings(); // ��لب البيانات الأصلية عند تشغيل المكون

      this.dataService.buildingsUpdated$.pipe(takeUntil(this.destroy$)).subscribe((updated) => {
        if (updated) {
          this.getBuildings(); // ⬅️ إعادة تحميل البيانات
        }
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
  
  
    handleClick(building: any): void {
      console.log(building);
      this.dataService.changeBuildingData(building);
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
      this.updatePagedItems();
    }
  
   
    removeSelection()
    {
      this.dataService.changeBuildingData(null);
  
    }

  

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
    

}
