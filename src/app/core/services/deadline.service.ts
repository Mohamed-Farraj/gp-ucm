import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeadlineService {

private readonly _HttpClient = inject(HttpClient)
token:string = '';


  addDeadLine(uid:number,data:object):Observable<any>
  {
    if (localStorage.getItem('userToken') !== null) {
      this.token = localStorage.getItem('userToken')!;
    }
   return this._HttpClient.post(`${environment.baseUrl}/admin/application-deadline/${uid}` , data)
 
  }

  getDeadLine(uid:number): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/public/all-deadlines/university/${uid}`);
  }


  deleteDeadLine(uid:number,id: number): Observable<any> 
  {
    
    return this._HttpClient.delete(`${environment.baseUrl}/admin/delete-application-deadline?universityId=${uid}&deadlineId=${id}`);
  }


  updateDeadLine(uid:number,id: number, data: object): Observable<any>
  {
    return this._HttpClient.put(`${environment.baseUrl}/admin/edit/update-application-deadline?deadlineId=${id}&universityId=${uid}`, data);
  }




}
