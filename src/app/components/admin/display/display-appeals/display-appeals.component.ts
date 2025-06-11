import { ChangeDetectorRef, Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AppealsService } from '../../../../core/services/appeals.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SharedDataService } from '../../../../core/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Location, NgClass } from '@angular/common';
import { UsersSideListComponent } from '../users-side-list/users-side-list.component';

@Component({
  selector: 'app-display-appeals',
  standalone: true,
  imports: [NgClass , UsersSideListComponent],
  templateUrl: './display-appeals.component.html',
  styleUrl: './display-appeals.component.scss'
})
export class DisplayAppealsComponent {

   private readonly _AppealsService = inject(AppealsService);
  public readonly _AuthService = inject(AuthService)
  private readonly dataService = inject(SharedDataService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly location = inject(Location)
  Appeals: any[] = [];
  filteredAppeals: any[] = [];
  selected: any;
  private destroy$ = new Subject<void>(); // Subject لتتبع التدمير
  constructor(private cd: ChangeDetectorRef) {
    this.dataService.currentStudentData.pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('Appeals data:', data);
      this.selected = data;
      
      // Filter only when we have complaints
      if (this.Appeals.length) {
        this.filteredAppeals = this.filterAppeals(this.Appeals);
      }
    });
  }





    



  // submitAppeal() {
  //   const userId: any = localStorage.getItem('Uid');
  //   console.log(this.appealForm.value);
  //   this._AppealsService.createAppeal(userId,this.appealForm.value).subscribe({
  //     next: (response: any) => {
  //       console.log('appeal added', response);
  //       this.Appeals.push(response.data);
  //       this.appealForm.reset();
  //       this.getmyAppeal()
  //     },
  //     error: (error: any) => {
  //       console.error(error);
  //     }
  //   });
  // }

 ngOnInit() {
    this.checkAuthAndLoadData();
    // if(localStorage.getItem('role')?.includes('ADMIN')) this.isAdmin = true
    
    // الحصول على المسار الحالي بدون query parameters
  }


  private checkAuthAndLoadData() {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('userToken');
  
    
  
    if (role?.includes('ADMIN')) {

      this._AppealsService.getAllAppeals().subscribe({
        next: (response: any) => {
          console.log('all Appeals', response);
          this.Appeals = response.data;
          
          // Apply filter after loading Appeals
          this.filteredAppeals = this.filterAppeals(this.Appeals);
          this.cd.detectChanges();
        },
        error: (error: any) => {
          console.error(error,token);
        }
      });

    } else if (role === 'USER') {

      this.getmyAppeal();
    }
  }

  getmyAppeal(){
    const uid:number = Number(localStorage?.getItem('Uid')) || 0;
    console.log(uid);
    this._AppealsService.getMyAppeal(uid).subscribe({
      next: (response: any) => {
        console.log('user Appeal', response);
        this.Appeals = response.data;
        
        this.filteredAppeals = this.Appeals.reverse();
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  filterAppeals(Appeals: any[]): any[] {
    console.log('filteredAppeals', this.selected?.userId);
    
    // Use optional chaining and nullish coalescing
    if (!this.selected?.userId) {
      return Appeals;
    }
    
    return Appeals.filter((Appeals: any) => 
      Appeals.userId === this.selected?.userId
    );
  }


  readMore(Appeal:string){
    Swal.fire(Appeal);
  }


 deleteAppeal(id: number) {
  this._AppealsService.deleteAppeal(id).subscribe({
    next: (response: any) => {
      console.log('appeal deleted', response);

      // شيل الـ appeal من المصفوفة اللي في الفرونت
      this.Appeals = this.Appeals.filter(app => app.id !== id);
      this.filteredAppeals = this.filteredAppeals.filter(app => app.id !== id);

      // تحديث للـ View
      this.cd.detectChanges();

     
    },
    error: (error: any) => {
      console.error(error);
    
    }
  });
}



  onUpdateAppealStatus(id: number, newStatus: string) {
    // ممكن تبعت request data فاضية أو فيها بيانات حسب الـ API
    const requestData = {}; // أو { ... } لو فيه بيانات لازم تبعتها
    this._AppealsService.updateAppealStatus(id, newStatus, ).subscribe({

      next: (response) => {
        console.log('Status updated successfully:', response);
         this.checkAuthAndLoadData();
        // هنا اعمل أي تحديث في الفرونت حسب الحاجة (مثلاً غير الحالة في UI)
      },
      error: (err) => {
        console.error('Error updating status:', err);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
