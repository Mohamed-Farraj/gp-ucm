import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeadlineService {

private readonly _HttpClient = inject(HttpClient)


  addDeadLine(data:object):Observable<any>
  {
   return this._HttpClient.post('http://localhost:8080/admin/application-deadline/1' , data , 

   {headers: new HttpHeaders({
           'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb2hhbWVkbW9oYW1lZDEyNjJAZ21haWwuY29tIiwiaWF0IjoxNzQxNjM4NDIxLCJleHAiOjE3NDE3MjQ4MjF9.KuYPpyxv_vmr5EBqiA7Yq5qSEmDNTRChZnvMQyf2unLuXzW_D-MEUjmPBc-O9Zy7',
           'Content-Type': 'application/json'
         })}


   )
 
  }

  getDeadLine(): Observable<any> {
    return this._HttpClient.get('http://localhost:8080/public/all-deadlines/university/1');
  }


  deleteDeadLine(id: number): Observable<any> 
  {
    return this._HttpClient.delete(`http://localhost:8080/admin/delete-application-deadline?universityId=1&deadlineId=${id}`, {headers: new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb2hhbWVkbW9oYW1lZDEyNjJAZ21haWwuY29tIiwiaWF0IjoxNzQxNjM4NDIxLCJleHAiOjE3NDE3MjQ4MjF9.KuYPpyxv_vmr5EBqiA7Yq5qSEmDNTRChZnvMQyf2unLuXzW_D-MEUjmPBc-O9Zy7',
      'Content-Type': 'application/json'
    })}
);
  }


  updateDeadLine(id: number, data: object): Observable<any>
  {
    return this._HttpClient.put(`http://localhost:8080/admin/update-application-deadline?deadlineId=${id}&universityId=1`, data, {headers: new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb2hhbWVkbW9oYW1lZDEyNjJAZ21haWwuY29tIiwiaWF0IjoxNzQxNjM4NDIxLCJleHAiOjE3NDE3MjQ4MjF9.KuYPpyxv_vmr5EBqiA7Yq5qSEmDNTRChZnvMQyf2unLuXzW_D-MEUjmPBc-O9Zy7',
      'Content-Type': 'application/json'
    })}
);
  }




}
