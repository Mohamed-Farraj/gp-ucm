import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { SharedDataService } from '../../../core/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppealsService } from '../../../core/services/appeals.service';
import { DatePipe, Location, NgClass, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { UsersSideListComponent } from '../../admin/display/users-side-list/users-side-list.component';

@Component({
  selector: 'app-appeals',
  standalone: true,
  imports: [DatePipe, NgIf, UsersSideListComponent , ReactiveFormsModule , NgClass],
  templateUrl: './appeals.component.html',
  styleUrl: './appeals.component.scss'
})
export class AppealsComponent {
 private readonly _AppealsService = inject(AppealsService);
  public readonly _AuthService = inject(AuthService)
  private readonly dataService = inject(SharedDataService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly location = inject(Location)
  Appeals: any[] = [];
  filteredAppeals: any[] = [];
  selected: any;
  isAdmin: boolean = false;
  private destroy$ = new Subject<void>(); // Subject لتتبع التدمير
  private readonly _formBuilder= inject(FormBuilder)
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
  appealForm :FormGroup = this._formBuilder.group({
     reason: [
    '', 
    [
      Validators.required,
      Validators.pattern(/^(?!.*(select|insert|update|delete|drop|;|--|<|>)).*$/i),
      (control: AbstractControl) => {
        return (control.value || '').trim().length === 0 ? { whitespace: true } : null;
      }
    ]
  ]
  });


  submitAppeal() {
    const userId: any = localStorage.getItem('Uid');
    console.log(this.appealForm.value);
    this._AppealsService.createAppeal(userId,this.appealForm.value).subscribe({
      next: (response: any) => {
        console.log('appeal added', response);
        this.Appeals.push(response.data);
        this.appealForm.reset();
        this.getmyAppeal()
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
    this.getmyAppeal();
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
    this.isAdmin = false;
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





  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
