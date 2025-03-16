import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SharedDataService } from '../../core/services/shared-data.service';
import { NgClass, NgFor } from '@angular/common';
import { ArDisplayComponent } from "../ar-display/ar-display.component";
import Aos from 'aos';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AddGuideLinesComponent } from "../add-guide-lines/add-guide-lines.component";
import { AdminLandingPageComponent } from "../admin-landing-page/admin-landing-page.component";
import { DeadlinsFormComponent } from "../deadlins-form/deadlins-form.component";
import { PenaltyComponent } from "../penalty/penalty.component";
import { MatDialogModule } from '@angular/material/dialog';
import { AddPenaltyComponent } from "../add-penalty/add-penalty.component";
import { UsersSideListComponent } from "../users-side-list/users-side-list.component";
import { UserDashboardComponent } from "../user-dashboard/user-dashboard.component";
import { DisplayComplaintsComponent } from '../display-complaints/display-complaints.component';
import { BuildingsListComponent } from "../buildings-list/buildings-list.component";
import { RoomsComponent } from "../rooms/rooms.component";

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [ArDisplayComponent, NgClass, NgFor, ReactiveFormsModule, AddGuideLinesComponent, AdminLandingPageComponent, DeadlinsFormComponent, AddPenaltyComponent, UsersSideListComponent, UserDashboardComponent, DisplayComplaintsComponent, BuildingsListComponent, RoomsComponent],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'] // تم تصحيح الاسم هنا
})
export class AdminSidebarComponent {
  
  protected readonly _AuthService = inject(AuthService);
  private readonly dataService = inject(SharedDataService);
  private readonly cd = inject(ChangeDetectorRef);
  
  res: any[] = []; // البيانات الأصلية
  selectedAdmissionRequest: any = {};
  isCollapsed: boolean = true;
  pagedItems: any[] = [];
  currentPage: number = 1;
  pageSize: number = 7;
  totalPages: number = 0;
  pages: number[] = [];
  searchControl = new FormControl('');
  // مصفوفة لتخزين الحالات المختارة من checkboxes
   // متغير للفرز: "normal" أو "reverse"
   sortControl = new FormControl('normal');
  selectedStatuses: string[] = [];
  filteredItems: any[] = [];
  activeTab: string = 'home';
  objectData: any ;

setActiveTab(tab: string) {
  this.activeTab = tab;
  console.log('Current Active Tab:', this.activeTab);
  this.isCollapsed=true;
}

getActiveTab() {
  const activeTab = document.querySelector('.tab-pane.show.active');
  console.log('Active Tab:', activeTab?.id);
}


  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  constructor() {
    this.dataService.currentStudentData.subscribe(data => {
      console.log('Received data:', data);
      this.selectedAdmissionRequest = data; 
    });
  }


  ngOnInit(): void {
    this._AuthService.getApplications().subscribe({
      next: (res: any) => {
       
        console.log(res);
        this.res = res.data;
        this.getAnalysis();
        this.filteredItems = this.res;
        console.log(this.res);
      },
      error: (err) => { console.log(err); },
    });
   
  }


  getAnalysis() {
    this.objectData = {
      male: {
        UNDER_REVIEW: 0,
        ACCEPTED: 0,
        REJECTED: 0,
        total: 0
      },
      female: {
        UNDER_REVIEW: 0,
        ACCEPTED: 0,
        REJECTED: 0,
        total: 0
      }
    };
  
    for (const item of this.res) {
      // Assuming the gender is provided as 'MALE' or 'FEMALE'
      const genderKey = item.gender.toUpperCase() === 'FEMALE' ? 'female' : 'male';
  
      // Increment the overall total for the gender
      this.objectData[genderKey].total++;
  
      // Increment count for each status
      if (item.status === 'UNDER_REVIEW') {
        this.objectData[genderKey].UNDER_REVIEW++;
      } else if (item.status === 'ACCEPTED') {
        this.objectData[genderKey].ACCEPTED++;
      } else if (item.status === 'REJECTED') {
        this.objectData[genderKey].REJECTED++;
      }
    }
  
    console.log('Analysis:', this.objectData);
  }
  
 
  

 
  
}
