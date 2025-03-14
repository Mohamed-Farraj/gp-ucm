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
   return this._HttpClient.post('http://localhost:8080/admin/add-penalty' , data , 

   {headers: new HttpHeaders({
           'Authorization': `Bearer ${this.token}`,
           'Content-Type': 'application/json'
         })}


   )
 
  }

  getAllpenalties(): Observable<any> {
    return this._HttpClient.get('http://localhost:8080/admin/get-all-penalties' ,  {headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    })});
  }


  deletePenalty(id: number): Observable<any> 
  {
    if (localStorage.getItem('userToken') !== null) {
      this.token = localStorage.getItem('userToken')!;
    }
    return this._HttpClient.delete(`${environment.baseUrl}/admin/delete-penalty/${id}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    })}
);
  }


 getPenalityById(id: number): Observable<any> {
  if (localStorage.getItem('userToken') !== null) {
    this.token = localStorage.getItem('userToken')!;
  }
   return this._HttpClient.get(`${environment.baseUrl}/admin/get-penalty/${id}`,  {headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    })});
 }

 getPenaltyforSpecificUser(id: number): Observable<any> {
  if (localStorage.getItem('userToken') !== null) {
    this.token = localStorage.getItem('userToken')!;
  }
  return this._HttpClient.get(`${environment.baseUrl}/admin/get-all-user-penalties/${id}`,  {headers: new HttpHeaders({
     'Authorization': `Bearer ${this.token}`,
     'Content-Type': 'application/json'
   })});
}


}
