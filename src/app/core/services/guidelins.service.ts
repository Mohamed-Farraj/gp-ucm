import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuidelinsService {

  private readonly _HttpClient = inject(HttpClient)
  private token:string = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb2hhbWVkbW9oYW1lZG1vaGFtZWRtb21vQGdtYWlsLmNvbSIsImlhdCI6MTc0MTM5OTE2NiwiZXhwIjoxNzQxNDg1NTY2fQ.c7q2sqajeLE14VIj101VIMu4RMy6QNoc8gC2wExiQ0z80ZqZDJjf5TIvWMStb8L7"


  setguideForm(data:object): Observable<any>
  {
   return this._HttpClient.post('http://localhost:8080/admin/add-guidelines/1' , data , 

   {headers: new HttpHeaders({
           'Authorization': `Bearer ${this.token}`,
           'Content-Type': 'application/json'
         })}


   )
 
  }

  getGuidelines(): Observable<any> {
    return this._HttpClient.get('http://localhost:8080/public/get-guidelines/1');
  }


  deleteGuideline(id: number): Observable<any> 
  {
    return this._HttpClient.delete(`http://localhost:8080/admin/delete-guidelines?universityId=1&guidelineId=${id}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    })}
);
  }


  updateGuideline(id: number, data: object): Observable<any>
  {
    return this._HttpClient.put(`http://localhost:8080/admin/update-guidelines?universityId=1&guidelineId=${id}`, data, {headers: new HttpHeaders({
      'Authorization':`Bearer ${this.token}`,
      'Content-Type': 'application/json'
    })}
);
  }
}
