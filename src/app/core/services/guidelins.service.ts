import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuidelinsService {

  private readonly _HttpClient = inject(HttpClient)


  setguideForm(data:object): Observable<any>
  {
   return this._HttpClient.post('http://localhost:8080/admin/edit/add-guidelines/1' , data)
 
  }

  getGuidelines(): Observable<any> {
    return this._HttpClient.get('http://localhost:8080/public/get-guidelines/1');
  }


  deleteGuideline(id: number): Observable<any> 
  {
    return this._HttpClient.delete(`http://localhost:8080/admin/delete-guidelines?universityId=1&guidelineId=${id}`);
  }


  updateGuideline(id: number, data: object): Observable<any>
  {
    return this._HttpClient.put(`http://localhost:8080/admin/edit/update-guidelines?universityId=1&guidelineId=${id}`, data);
  }
}
