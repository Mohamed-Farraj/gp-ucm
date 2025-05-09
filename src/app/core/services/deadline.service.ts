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


  addDeadLine(data:object):Observable<any>
  {
    if (localStorage.getItem('userToken') !== null) {
      this.token = localStorage.getItem('userToken')!;
    }
   return this._HttpClient.post('http://localhost:8080/admin/edit/application-deadline/1' , data)
 
  }

  getDeadLine(): Observable<any> {
    return this._HttpClient.get('http://localhost:8080/public/all-deadlines/university/1');
  }


  deleteDeadLine(id: number): Observable<any> 
  {
    
    return this._HttpClient.delete(`${environment.baseUrl}/admin/delete-application-deadline?universityId=1&deadlineId=${id}`);
  }


  updateDeadLine(id: number, data: object): Observable<any>
  {
    return this._HttpClient.put(`${environment.baseUrl}/admin/edit/update-application-deadline?deadlineId=${id}&universityId=1`, data);
  }




}
