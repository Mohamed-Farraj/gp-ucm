import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private _HttpClient:HttpClient) { }

  getDeadline():Observable<any> {
    return this._HttpClient.get('http://localhost:8080/public/all-deadlines/university/1');
  }

  getGuidlines():Observable<any> {
    return this._HttpClient.get(`http://localhost:8080/public/get-guidelines/1`);
  }
}
