import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { SharedDataService } from './shared-data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArService {
    private readonly _HttpClient = inject(HttpClient)
    private readonly router = inject(Router)
    private readonly sharedDataService = inject(SharedDataService)

  constructor() { }
   getApplications():Observable<any>
    {
    return this._HttpClient.get(`${environment.baseUrl}/admin/view/admission-requests`);
    }
  
  
    DecideArState(UId:number,Status:string):Observable<any>{
      return this._HttpClient.put(`${environment.baseUrl}/admin/edit/admission-requests/${UId}/status?status=${Status}`,
        null,
          );
    }

    getSpecificApplication(id:number):Observable<any>
    {
      return this._HttpClient.get(`${environment.baseUrl}/admin/view/admission-requests/${id}`);
    }

  getArById(id:number):Observable<any>
  {
    return this._HttpClient.get(`${environment.baseUrl}/user/admission-requests/${id}`);
  }
  
  updateAr(id:number,data:object):Observable<any>
  {
    return this._HttpClient.put(`${environment.baseUrl}/user/admission-requests/${id}`,data);
  }

}
