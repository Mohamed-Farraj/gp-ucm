import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

 private readonly _HttpClient = inject(HttpClient)
 token:string = '';
 
 
   createRoom(data:object):Observable<any>
   {
     if (localStorage.getItem('userToken') !== null) {
       this.token = localStorage.getItem('userToken')!;
     }
    return this._HttpClient.post('http://localhost:8080/admin/rooms/add' , data)
  
   }
 
   getAllRooms(): Observable<any> {
     return this._HttpClient.get('http://localhost:8080/public/rooms/getAll/${id}');
   }
 
 
   deletePenalty(id: number): Observable<any> 
   {
   
     return this._HttpClient.delete(`${environment.baseUrl}/admin/delete-penalty/${id}`);
   }
 
 
  getPenalityById(id: number): Observable<any> {
   if (localStorage.getItem('userToken') !== null) {
     this.token = localStorage.getItem('userToken')!;
   }
    return this._HttpClient.get(`${environment.baseUrl}/admin/get-penalty/${id}`);
  }
 
  getPenaltyforSpecificUser(id: number): Observable<any> {
  
   return this._HttpClient.get(`${environment.baseUrl}/admin/get-all-user-penalties/${id}`);
 }
 
 
}
