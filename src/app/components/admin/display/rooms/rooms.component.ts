import { SharedDataService } from '../../../../core/services/shared-data.service';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { BuildingsService } from '../../../../core/services/buildings.service';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { BuildingsListComponent } from '../buildings-list/buildings-list.component';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddRoomComponent } from '../../forms/add-room/add-room.component';
import { Irooms } from '../../../../core/interfaces/irooms';
import { AddBuildingComponent } from '../../forms/add-building/add-building.component';
import { Ibuilding } from '../../../../core/interfaces/ibuilding';
import { AuthService } from '../../../../core/services/auth.service';
import { PrivilegesDirective } from '../../../../core/directives/privileges.directive';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [NgIf, BuildingsListComponent , PrivilegesDirective],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent {

  rooms: any = [];
  selectedBuilding: any;
  @Output() refreshParent = new EventEmitter<void>();
  private destroy$ = new Subject<void>(); // Subject لتتبع التدمير
  private readonly _BuildingsService=inject (BuildingsService);
  public readonly _AuthService = inject(AuthService)
  public  dialog = inject(MatDialog);
  Irooms: Irooms[] = [];
  room!: Irooms;
  
  Ibuildings: Ibuilding[] = [];
  building!: Ibuilding;
  getArabicType(type: string): string {
    const translations: { [key: string]: string } = {
      'SINGLE': 'فردي',
      'DOUBLE': 'ثنائي',
      'DORM': 'مسكن'
    };
    return translations[type] || type; // Default to original if not found
  }
  getArabicGender(type: string): string {
    const translations: { [key: string]: string } = {
      'MALE': 'ذكور',
      'FEMALE': 'اناث'
    };
    return translations[type] || type; // Default to original if not found
  }
  getArabicStatue(type: string): string {
    const translations: { [key: string]: string } = {
      'OCCUPIED': 'مشغول',
      'MAINTAINANCE': 'صيانة',
      'AVAILABLE': 'متاح'
    };
    return translations[type] || type; // Default to original if not found
  }

  constructor(
    private dataService: SharedDataService,
    private buildingRoomService: BuildingsService
  ) {}

  ngOnInit(): void {
    // الاشتراك في تغير بيانات المبنى
    this.dataService.currentBuildingData.pipe(takeUntil(this.destroy$)).subscribe(building => {
        this.selectedBuilding = building;
        // عند تغيير بيانات المبنى، استدعاء API لجلب الغرف للمبنى
        if(building?.id)
        this.getAllRooms(building?.id);
    });
  }

  getAllRooms(buildingId: number): void {
    this.buildingRoomService.getAllRooms(buildingId).subscribe({
      next: (response: any) => {
        console.log('Rooms:', response);
        this.rooms = response.data; // أو حسب البنية
        this.Irooms=response.data
      },
      error: (error: any) => {
        if (error.status === 404) {
          this.rooms = [];
        }
        console.error(error);
      }
    });
  }

 deleteRoom(buildingId: number, roomId: number) {
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
      this.buildingRoomService.deleteRoom(buildingId, roomId).subscribe({
        next: (response: any) => {
          console.log('Room deleted:', response);
          this.getAllRooms(this.selectedBuilding.id);
          Swal.fire({
            title: 'تم الحذف!',
            text: 'تم حذف الغرفة بنجاح.',
            icon: 'success'
          });
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


deleteBuilding(universityId: number, buildingId: number) {
  if (this.rooms.length == 0) {
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
        this.buildingRoomService.deleteBuilding(universityId, buildingId).subscribe({
          next: (response: any) => {
            console.log('Building deleted:', response);
            this.dataService.changeBuildingData(null); // حذف المبنى من الذاكرة أو البيانات المعروضة
            this.dataService.notifyBuildingsChanged();
            Swal.fire({
              icon: 'success',
              title: 'تم الحذف!',
              text: 'تم حذف المبنى بنجاح.'
            });
          },
          error: (error: any) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'خطأ',
              text: 'حدث خطأ أثناء حذف المبنى.'
            });
          }
        });
      }
    });
  } else {
    Swal.fire({
      icon: "error",
      text: "يجب أن يكون المبنى خالي من الغرف أولاً"
    });
  }
}


openDialog(): void {
      const dialogRef = this.dialog.open(AddRoomComponent, {
        width: '50%', // Set the width of the dialog
        data: this.rooms || null, // Pass data to the dialog
        panelClass: 'custom-dialog-container'

      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getAllRooms(this.selectedBuilding?.id); // Refresh the list after the dialog is closed
        }
      });
    }

    openBuildingDialog(): void {
      const dialogRef = this.dialog.open(AddBuildingComponent, {
        width: '50%', // Set the width of the dialog
        data: this.building || null, // Pass data to the dialog
        panelClass: 'custom-dialog-container'

      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.dataService.notifyBuildingsChanged();
        }
      });
    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
