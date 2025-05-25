import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuidelinsService {

  private readonly _HttpClient = inject(HttpClient)


  setguideForm(data:object): Observable<any>
  {
   return this._HttpClient.post(`${environment.baseUrl}/admin/edit/add-guidelines/1` , data)
 
  }

  getGuidelines(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/public/get-guidelines/1`);
  }


  deleteGuideline(id: number): Observable<any> 
  {
    return this._HttpClient.delete(`${environment.baseUrl}/admin/delete-guidelines?universityId=1&guidelineId=${id}`);
  }


  updateGuideline(id: number, data: object): Observable<any>
  {
    return this._HttpClient.put(`${environment.baseUrl}/admin/edit/update-guidelines?universityId=1&guidelineId=${id}`, data);
  }
}
