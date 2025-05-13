import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { SharedDataService } from './shared-data.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArService {
    private readonly _HttpClient = inject(HttpClient)
    private readonly router = inject(Router)
    private readonly sharedDataService = inject(SharedDataService)

  constructor() { }
  getApplications(params?: any,offset?:number): Observable<any> {
    let httpParams = new HttpParams({ fromObject: params || {} });
    httpParams = httpParams.append('offset', offset ?? 0);
    httpParams = httpParams.append('limit', 20);
    console.log('params in service',params,offset);
    return this._HttpClient.get(`${environment.baseUrl}/admin/view/admission-requests`, {
      params: httpParams
    });
  }
  
  
  DecideArState(UId:number,Status:string,message?:string):Observable<any>{
    const url = `${environment.baseUrl}/admin/edit/admission-requests/${UId}/status?status=${Status}`
    let Body = {}
    if(Status !== 'REJECTED')
    {
      Body = 
      {
        admissionStatusNotes: Status
       }
    }
    else
    {
      Body = 
      {
        admissionStatusNotes: message
       }
    }
    return this._HttpClient.put(url,Body);
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

  getSortedApplications(){
    return this._HttpClient.get(`${environment.baseUrl}/admin/view/sorted-applicants`);
  }

  getArStatistics(){
    return this._HttpClient.get(`${environment.baseUrl}/admin/view/admission-analysis`);
  }

}
