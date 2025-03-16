import { Component, EventEmitter, Output } from '@angular/core';
import { SharedDataService } from '../../core/services/shared-data.service';
import { BuildingsService } from '../../core/services/buildings.service';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { BuildingsListComponent } from '../buildings-list/buildings-list.component';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [NgIf],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent {

  rooms: any = [];
  selectedBuilding: any;
  @Output() refreshParent = new EventEmitter<void>();

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
    this.dataService.currentBuildingData.subscribe(building => {
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
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  deleteRoom(buildingId:number,roomId: number)
  {
    this.buildingRoomService.deleteRoom(buildingId,roomId).subscribe({
      next: (response: any) => {
        console.log('Room deleted:', response);
        this.getAllRooms(this.selectedBuilding.id); 
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  deleteBuilding(universityId:number,buildingId :number)
  {
    if(this.rooms.length == 0)
    {
    this.buildingRoomService.deleteBuilding(universityId,buildingId).subscribe({
      next: (response: any) => {
        console.log('Building deleted:', response);
        this.dataService.changeBuildingData(null); // حذف المبنى من الخا��ية التي تمتلكها
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
  else{
    Swal.fire({
      icon:"error",
      text:"يجب ان يكون المبنى خالي من الغرف اولا"
    }
    )
  }
}
}
