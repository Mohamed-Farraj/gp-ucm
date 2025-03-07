import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private dataSource = new BehaviorSubject<any>(null);
  currentStudentData = this.dataSource.asObservable();

  changeStudentData(data: any) {
    this.dataSource.next(data);
  }
  
}
