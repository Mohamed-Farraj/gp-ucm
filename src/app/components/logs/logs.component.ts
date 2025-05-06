import { Component, inject } from '@angular/core';
import { LogService } from '../../services/log.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { debounceTime } from 'rxjs';
import { LogCardComponent } from '../log-card/log-card.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [NgFor,NgIf,DatePipe,ReactiveFormsModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent {

    
        //#region pagination attributes
        selectedAdmissionRequest: any = {};
        selectedBuilding: any = {};
        isCollapsed: boolean = true;
        pagedItems: any[] = [];
        currentPage: number = 1;
        pageSize: number = 20;
        totalPages: number = 0;
        pages: number[] = [];
        //#endregion


        //#region filtration attributes
                  searchControl = new FormControl('');
                  sortControl = new FormControl('reverse');// متغير للفرز: "normal" أو "reverse"
                  selectedStatuses: string[] = [];// مصفوفة لتخزين الحالات المختارة من checkboxes
                  selectedGenders: string[] = [];// مصفوفة لتخزين gender المختارة من checkboxes
                  filteredItems: any[] = [];
                  //#endregion
            
  private readonly log = inject(LogService)
  private readonly dialog = inject(MatDialog);

  res: any;

  ngOnInit(): void {

    this.log.getLogs().subscribe({
      next: (res:any) => {
        console.log(res);
        this.res = res.data;
        this.filteredItems = this.res;
        console.log(this.res);
        this.initPagination();
        this.applyFilters();
      },
      error: (err) => {console.log(err);},
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


    openCard(item: any): void {
     
       const dialogRef = this.dialog.open(LogCardComponent, {
                  width: '50%', // Set the width of the dialog
                  data: {  // Add data property
                    logData: item  // Pass your item here
                  },
                  panelClass: 'custom-dialog-container'
          
                });
            

    }


}
