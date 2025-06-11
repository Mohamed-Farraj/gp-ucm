import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly _HttpClient = inject(HttpClient)

  constructor() { }

createAdminAcc(data:object):Observable<any>{

  return this._HttpClient.post(`${environment.baseUrl}/public/register` , data)

}

getAllAdmins(offset?:number):Observable<any>{
let httpParams = new HttpParams({ fromObject:  {} });
    httpParams = httpParams.append('offset', offset ?? 0);
    httpParams = httpParams.append('limit', 10);
    console.log('params in service',offset);
  return this._HttpClient.get(`${environment.baseUrl}/admin/all-admins`, {
      params: httpParams
    });

}

}