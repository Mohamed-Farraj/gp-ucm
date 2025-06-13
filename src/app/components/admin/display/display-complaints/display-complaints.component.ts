import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ComplaintsService } from '../../../../core/services/complaints.service';
import { DatePipe, Location, NgIf } from '@angular/common';
import { SharedDataService } from '../../../../core/services/shared-data.service';
import { Subject, takeUntil } from 'rxjs';
import { UsersSideListComponent } from "../users-side-list/users-side-list.component";
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { userInfo } from 'os';
import { AuthService } from '../../../../core/services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { PrivilegesDirective } from '../../../../core/directives/privileges.directive';

@Component({
  selector: 'app-display-complaints',
  standalone: true,
  imports: [ PrivilegesDirective , DatePipe, NgIf, UsersSideListComponent , ReactiveFormsModule ,NgxPaginationModule] ,
  templateUrl: './display-complaints.component.html',
  styleUrl: './display-complaints.component.scss'
})
export class DisplayComplaintsComponent implements OnInit {

  private readonly complaintsService = inject(ComplaintsService);
  public readonly _AuthService = inject(AuthService)
  private readonly dataService = inject(SharedDataService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly location = inject(Location)
  complaints: any[] = [];
  filteredComplaints: any[] = [];
  page: number = 1; // الصفحة الحالية
  selected: any;
  isAdmin: boolean = false;
  private destroy$ = new Subject<void>(); // Subject لتتبع التدمير
  private readonly _formBuilder= inject(FormBuilder)
  constructor(private cd: ChangeDetectorRef) {
    this.dataService.currentStudentData.pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('complaint data:', data);
      this.selected = data;
      
      // Filter only when we have complaints
      if (this.complaints.length) {
        this.filteredComplaints = this.filterComplaints(this.complaints);
      }
    });
  }




  complaintsForm :FormGroup = this._formBuilder.group({
    complaintText: ['', Validators.required],

    
  });


  submitComplaint() {
    const userId: any = localStorage.getItem('Uid');
    console.log(this.complaintsForm.value);
    this.complaintsService.createComplaint(userId,this.complaintsForm.value).subscribe({
      next: (response: any) => {
        console.log('complaint added', response);
        this.complaints.push(response.data);
        this.complaintsForm.reset();
        this.getmyComplaints()
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

 ngOnInit() {
    this.checkAuthAndLoadData();
    // if(localStorage.getItem('role')?.includes('ADMIN')) this.isAdmin = true
    
    // الحصول على المسار الحالي بدون query parameters
    let currentPath = this.location.path();
    console.log('Current Path:', currentPath);
    if(currentPath.includes('admin')) this.isAdmin = true

    console.log("isAdmin",this.isAdmin);
  
  }


  private checkAuthAndLoadData() {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('userToken');
  
    
  
    if (role?.includes('ADMIN')) {

      this.complaintsService.getAllComplaints().subscribe({
        next: (response: any) => {
          console.log('all complaints', response);
          this.complaints = response.data;
          
          // Apply filter after loading complaints
          this.filteredComplaints = this.filterComplaints(this.complaints);
          this.cd.detectChanges();
        },
        error: (error: any) => {
          console.error(error,token);
        }
      });

    } else if (role === 'USER') {

      this.getmyComplaints();
    }
  }

  getmyComplaints(){
    const uid:number = Number(localStorage?.getItem('Uid')) || 0;
    console.log(uid);
    this.isAdmin = false;
    this.complaintsService.getMyComplaints(uid).subscribe({
      next: (response: any) => {
        console.log('user complaints', response);
        this.complaints = response.data;
        
        this.filteredComplaints = this.complaints.reverse();
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  filterComplaints(complaints: any[]): any[] {
    console.log('filterComplaints', this.selected?.userId);
    
    // Use optional chaining and nullish coalescing
    if (!this.selected?.userId) {
      return complaints;
    }
    
    return complaints.filter((complaint: any) => 
      complaint.userId === this.selected?.userId
    );
  }


  readMore(complaint:string){
    Swal.fire(complaint);
  }


 deleteComplaint(id: number) {
  Swal.fire({
    title: 'هل أنت متأكد؟',
    text: 'لن تتمكن من التراجع عن هذا',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#e12e2e',
    cancelButtonColor: '#111b31',
    confirmButtonText: 'نعم، احذفه',
    cancelButtonText: 'تراجع'
  }).then((result) => {
    if (result.isConfirmed) {
      this.complaintsService.deleteComplaint(id).subscribe({
        next: (response: any) => {
          console.log('complaint deleted', response);
          Swal.fire({
            title: 'تم الحذف!',
            text: 'تم حذف الشكوى بنجاح.',
            icon: 'success'
          });
          this.ngOnInit();
        },
        error: (error: any) => {
          console.error(error);
          Swal.fire({
            title: 'خطأ!',
            text: 'حدث خطأ أثناء الحذف.',
            icon: 'error'
          });
        }
      });
    }
  });
}



  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
