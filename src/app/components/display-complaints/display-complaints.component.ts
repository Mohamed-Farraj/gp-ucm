import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ComplaintsService } from '../../core/services/complaints.service';
import { DatePipe, NgIf } from '@angular/common';
import { SharedDataService } from '../../core/services/shared-data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-display-complaints',
  standalone: true,
  imports: [DatePipe,NgIf],
  templateUrl: './display-complaints.component.html',
  styleUrl: './display-complaints.component.scss'
})
export class DisplayComplaintsComponent implements OnInit {

  private readonly complaintsService = inject(ComplaintsService);
  private readonly dataService = inject(SharedDataService)
  complaints: any[] = [];
  filteredComplaints: any[] = [];
  selected: any;
  @Input() isAdmin: boolean = false;
  private destroy$ = new Subject<void>(); // Subject لتتبع التدمير

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

 ngOnInit() {
    this.checkAuthAndLoadData();
  }


  private checkAuthAndLoadData() {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('userToken');
  
    
  
    if (role === 'ADMIN') {

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

      const uid:number = Number(localStorage?.getItem('Uid')) || 0;
    console.log(uid);
    this.isAdmin = false;
    this.complaintsService.getComplaintsByUser(uid).subscribe({
      next: (response: any) => {
        console.log('user complaints', response);
        this.complaints = response.data;
        
        this.filteredComplaints = this.complaints;
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error(error);
      }
    });
    }
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


  deleteComplaint(id:number){
    this.complaintsService.deleteComplaint(id).subscribe({
      next: (response: any) => {
        console.log('complaint deleted', response);
        this.ngOnInit();
      },
      error: (error: any) => {
        console.error(error);
      }
  });
}


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
