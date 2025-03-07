import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SharedDataService } from '../../core/services/shared-data.service';
import { DatePipe, NgClass } from '@angular/common';
import { ArDisplayComponent } from "../ar-display/ar-display.component";
import bootstrap from '../../../main.server';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [ArDisplayComponent,NgClass],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent {

  isCollapsed: boolean = true;

  constructor() {
    this.dataService.currentStudentData.subscribe(data => {
      console.log('Received data:', data);
      this.selectedAdmissionRequest = data; 
    });
  }

handleClick(student:any) {
  console.log(student);
  this.dataService.changeStudentData(student);
}

  private readonly _AuthService = inject(AuthService);
  private readonly dataService =  inject(SharedDataService) ;
  res:any = [];
  selectedAdmissionRequest:any = {};
  ngOnInit(): void {
    //  this.res = this._AuthService.getApplications();
    // console.log(this.res);
    this._AuthService.getApplications().subscribe({
      next: (res:any) => 
        {
          console.log(res); this.res = res.data; 
          console.log(this.res);
        },
      error: (err) => {console.log(err);},
    });
  }
}
