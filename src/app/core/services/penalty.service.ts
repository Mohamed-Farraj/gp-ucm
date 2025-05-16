import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PenaltyService {

private readonly _HttpClient = inject(HttpClient)
token:string = '';


  createPenalty(data:object):Observable<any>
  {
    if (localStorage.getItem('userToken') !== null) {
      this.token = localStorage.getItem('userToken')!;
    }
   return this._HttpClient.post(`${environment.baseUrl}/admin/edit/add-penalty` , data)
 
  }

  getAllpenalties(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/admin/view/get-all-penalties`);
  }


  deletePenalty(id: number): Observable<any> 
  {
  
    return this._HttpClient.delete(`${environment.baseUrl}/admin/delete-penalty/${id}`);
  }


 getPenalityById(id: number): Observable<any> {
  if (localStorage.getItem('userToken') !== null) {
    this.token = localStorage.getItem('userToken')!;
  }
   return this._HttpClient.get(`${environment.baseUrl}/admin/view/get-penalty/${id}`);
 }

 getPenaltyforSpecificUser(id: number): Observable<any> {
 
  return this._HttpClient.get(`${environment.baseUrl}/admin/view/get-all-user-penalties/${id}`);
}


}
