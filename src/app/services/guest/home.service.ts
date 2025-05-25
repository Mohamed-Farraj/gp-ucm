import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../core/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private _HttpClient:HttpClient) { }

  getDeadline():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/public/all-deadlines/university/1`);
  }

  getGuidlines():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/public/get-guidelines/1`);
  }

  getApplicationStatusById(id:string):Observable<any>
  {
    return this._HttpClient.get(`${environment.baseUrl}/user/admission-requests/1/status?userId=${id}`);
  }
  getApplicationStatusByNationalId(id:string):Observable<any>
  {
    return this._HttpClient.get(`${environment.baseUrl}/public/admission-requests/nid/${id}/status`);
  }

}
