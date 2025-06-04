import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../core/environments/environment';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private _HttpClient:HttpClient) { }
     public readonly local = inject(LocalStorageService);


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
