import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuidelinsService {

  private readonly _HttpClient = inject(HttpClient)
  myheaders:any ={token: "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb2hhbWVkbW9oYW1lZEBnbWFpbC5jb20iLCJpYXQiOjE3NDEyOTk2MDgsImV4cCI6MTc0MTM4NjAwOH0.hcusQch227py8OkB-HTEfHAl-T9cI1LCNgirlo5vD39ooAFYSTgwr71ggcJABA0L"}


  setguideForm(data:object): Observable<any>
  {
   return this._HttpClient.post('http://localhost:8080/admin/add-guidelines/1' , data , 

   {headers: new HttpHeaders({
           'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb2hhbWVkbW9oYW1lZDFAZ21haWwuY29tIiwiaWF0IjoxNzQxMzg2NzM1LCJleHAiOjE3NDE0NzMxMzV9.aBsyEqhq6e-esFGzNsbYgqEh-ZbpNudWdaPCExINmJPDGxgsv-pfjaD6dblWVgr_',
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
      'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb2hhbWVkbW9oYW1lZDFAZ21haWwuY29tIiwiaWF0IjoxNzQxMzg2NzM1LCJleHAiOjE3NDE0NzMxMzV9.aBsyEqhq6e-esFGzNsbYgqEh-ZbpNudWdaPCExINmJPDGxgsv-pfjaD6dblWVgr_',
      'Content-Type': 'application/json'
    })}
);
  }


  updateGuideline(id: number, data: object): Observable<any>
  {
    return this._HttpClient.put(`http://localhost:8080/admin/update-guidelines?universityId=1&guidelineId=${id}`, data, {headers: new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb2hhbWVkbW9oYW1lZDFAZ21haWwuY29tIiwiaWF0IjoxNzQxMzg2NzM1LCJleHAiOjE3NDE0NzMxMzV9.aBsyEqhq6e-esFGzNsbYgqEh-ZbpNudWdaPCExINmJPDGxgsv-pfjaD6dblWVgr_',
      'Content-Type': 'application/json'
    })}
);
  }
}
