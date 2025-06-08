import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrivilegesService {
  private readonly _HttpClient = inject(HttpClient)

  constructor() { }

  assignPrivileges(data:object): Observable<any> //assign privileges
  {
    return this._HttpClient.post(`${environment.baseUrl}/admin/privileges/assign` , data)
  }

  revokePrivilegesFormUser(data:object): Observable<any> //revoke privileges
  {
    return this._HttpClient.post(`${environment.baseUrl}/admin/privileges/revoke` , data)
  }

  revokeAllPrivilegesFormUser(id:number): Observable<any> //delete privileges
  {
    return this._HttpClient.delete(`${environment.baseUrl}/admin/privileges/revoke-all/${id}`)
  }

  getAllPrivileges(): Observable<any> //get all privileges
  {
    return this._HttpClient.get(`${environment.baseUrl}/admin/privileges`)
  }

}
