import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { SharedDataService } from '../../../../core/services/shared-data.service';
import { Location, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ArDisplayComponent } from "../ar-display/ar-display.component";
import Aos from 'aos';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { AddGuideLinesComponent } from "../../forms/add-guide-lines/add-guide-lines.component";
import { AdminLandingPageComponent } from "../admin-landing-page/admin-landing-page.component";
import { DeadlinsFormComponent } from "../../forms/deadlins-form/deadlins-form.component";
import { PenaltyComponent } from "../../forms/penalty/penalty.component";
import { matDialogAnimations, MatDialogModule } from '@angular/material/dialog';
import { AddPenaltyComponent } from "../../forms/add-penalty/add-penalty.component";
import { UsersSideListComponent } from "../users-side-list/users-side-list.component";
import { UserDashboardComponent } from "../../../student/user-dashboard/user-dashboard.component";
import { DisplayComplaintsComponent } from '../display-complaints/display-complaints.component';
import { BuildingsListComponent } from "../buildings-list/buildings-list.component";
import { RoomsComponent } from "../rooms/rooms.component";
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { ActivationEnd, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    NgClass,
    MatTooltipModule,
    NgIf,
    NgFor,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgStyle,
    MatTooltipModule
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'] // تم تصحيح الاسم هنا
})
export class AdminSidebarComponent {
  
  public readonly _AuthService = inject(AuthService);
  private readonly dataService = inject(SharedDataService);
  private readonly router = inject(Router);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly location = inject(Location);
  private destroy$ = new Subject<void>(); // Subject لتتبع التدمير
  res: any[] = []; // البيانات الأصلية
  selectedAdmissionRequest: any = {};
  isCollapsed: boolean = true;
  activeTab: string = 'home';
  objectData: any ;
  navItems = [
    { id: 'home', icon: 'fa-chart-line', label: 'لوحة التحكم' },
    { id: 'ar', icon: 'fa-user', label: 'طلبات الألتحاق', requiredPrivilege: 'ACCESS_VIEW_ADMISSION_REQUESTS' },
    { id: 'penalty', icon: 'fa-triangle-exclamation', label: 'الجزاءات و العقوبات'  ,requiredPrivilege: 'ACCESS_VIEW_PENALTY'},
    { id: 'complaints', icon: 'fa-face-angry', label: 'الشكاوى' ,requiredPrivilege: 'ACCESS_VIEW_COMPLAINTS' },
    { id: 'buildings', icon: 'fa-building', label: 'المباني و الغرف'  },
    { id: 'assign-to-rooms', icon: 'fa-person-shelter', label: ' التسكين ' ,requiredPrivilege: 'ACCESS_VIEW_ADMISSION_REQUESTS' },
    { id: 'guidelines', icon: 'fa-rectangle-list', label: 'الإرشادات' },
    { id: 'deadline', icon: 'fa-calendar-days', label: 'مواعيد التقديم' },
    { id: 'meals', icon: 'fa-utensils', label: ' الوجبات' ,requiredPrivilege: 'ACCESS_MANAGE_MEALS' },
    { id: 'logs', icon: 'fa-folder', label: ' السجل' ,requiredPrivilege: 'ACCESS_LOGS' },
    { id: 'register-admin', icon: 'fa-user-tie', label: ' المشرفين' ,requiredPrivilege: 'ACCESS_VIEW_ADMINS' },
    { id: 'add-university', icon: 'fa-building-columns', label: ' الجامعات' ,requiredPrivilege: 'ACCESS_VIEW_UNIVERSITY' },
  ];
    private privileges: Set<string> = new Set();
filteredNavItems : any = [];

  sidebarScale: number   = 1;
  @HostListener('window:resize')
onResize() {
  const vh = window.innerHeight;
  if (vh < 800) {
    // this.sidebarScale = 0.85;
  } else {
    this.sidebarScale = 1;
  }
}

  
  // showSideContent = false;
  // currentRoute: string = '';
  // private allowedRoutes = ['ar', 'penalty', 'complaints', 'buildings'];
  
  // isSideContentAllowed(route: string): boolean {
  //   return this.allowedRoutes.includes(route);
  // }
  
 

setActiveTab(tab: string) {
  this.activeTab = tab;

  // this.router.navigate(['/admin', tab]);
  // console.log('Current Active Tab:', this.activeTab);
  // this.isSideContentAllowed(tab)

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
    this.dataService.currentStudentData.pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('Received data:', data);
      this.selectedAdmissionRequest = data; 
    });
  }


  ngOnInit(): void {

    if(this._AuthService.getRole()=="ADMIN"){
      this.filteredNavItems = [...this.navItems]
    }
    else{
        this.loadPrivileges();
  this.filteredNavItems = this.navItems.filter(item => {
    return (
      !item.requiredPrivilege || this.privileges.has(item.requiredPrivilege)
    );
  });

    }
    
  }


  loadPrivileges() {
    const saved = localStorage.getItem('privileges');
    if (saved) {
      this.privileges = new Set(JSON.parse(saved));
    }
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
  
 
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
 
  
}
