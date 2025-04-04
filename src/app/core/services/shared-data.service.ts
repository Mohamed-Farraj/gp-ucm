import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private dataSource = new BehaviorSubject<any>(null);
  currentStudentData = this.dataSource.asObservable();


  private userDataSubject = new BehaviorSubject<any>(null);
  userData = this.userDataSubject.asObservable();

  changeStudentData(data: any) {
    this.dataSource.next(data);
  }

  private buildingsList = new BehaviorSubject<any>(null); //for selection
  currentBuildingData = this.buildingsList.asObservable();

  changeBuildingData(data: any) {
    this.buildingsList.next(data);
  }


  private buildingsUpdated = new BehaviorSubject<boolean>(false);
  buildingsUpdated$ = this.buildingsUpdated.asObservable();

  notifyBuildingsChanged() {
    this.buildingsUpdated.next(true);
  }


  setUserData(data: any): void {
    if (data) {
      console.log('data in shared space ',data);
      this.userDataSubject.next(data);
    }
    else
    console.log('try to set null user data');
  }

   // Clear user data (e.g., on logout)
   clearUserData(): void {
    this.userDataSubject.next(null);
  }
  
}
