import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SharedDataService } from '../../core/services/shared-data.service';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ArDisplayComponent } from "../ar-display/ar-display.component";
import Aos from 'aos';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [ArDisplayComponent,NgClass,NgFor],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent {

  
  private readonly _AuthService = inject(AuthService);
  private readonly dataService =  inject(SharedDataService) ;
  res:any = [];
  selectedAdmissionRequest:any = {};
  isCollapsed: boolean = true;
  pagedItems: any[] = [];
  currentPage: number = 1;
  pageSize: number = 7;
  totalPages: number = 0;
  pages: number[] = [];


  toggleCollapsed(){
    this.isCollapsed =!this.isCollapsed;
    setTimeout(() => {
      Aos.refreshHard();
    }, 5000); 
  }

  constructor() {
    this.dataService.currentStudentData.subscribe(data => {
      console.log('Received data:', data);
      this.selectedAdmissionRequest = data; 
    });
  }

   // دالة لحساب عدد الصفحات وتحديث العناصر المعروضة
   initPagination(): void {
    this.totalPages = Math.ceil(this.res.length / this.pageSize);
    // إنشاء مصفوفة تحتوي على أرقام الصفحات
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePagedItems();
  }

  // دالة لتحديث العناصر المعروضة حسب الصفحة الحالية
  updatePagedItems(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedItems = this.res.slice(start, start + this.pageSize);
  }

  // تغيير الصفحة عند الضغط على رقم الصفحة أو Previous/Next
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedItems();
  }

handleClick(student:any) {
  console.log(student);
  this.dataService.changeStudentData(student);
}

getDisplayedPages(): number[] {
  const totalPages = this.totalPages;
  const currentPage = this.currentPage;
  let startPage: number, endPage: number;
  
  if (totalPages <= 5) {
    // إذا كان العدد الكلي للصفحات 5 أو أقل، اعرضهم جميعًا
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 3) {
      // في بداية القائمة
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 2 >= totalPages) {
      // في نهاية القائمة
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      // في الوسط
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

  ngOnInit(): void {
    //  this.res = this._AuthService.getApplications();
    // console.log(this.res);
    this._AuthService.getApplications().subscribe({
      next: (res:any) => 
        {
          console.log(res); this.res = res.data; 
          console.log(this.res);
          
          this.initPagination();
        },
      error: (err) => {console.log(err);},
    });
  }
}
