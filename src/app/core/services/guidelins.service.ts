import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuidelinsService {

  private readonly _HttpClient = inject(HttpClient)


  setguideForm(uid:number,data:object): Observable<any>
  {
   return this._HttpClient.post(`${environment.baseUrl}/admin/edit/add-guidelines/${uid}` , data)
 
  }

  getGuidelines(uid:number = 1): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/public/get-guidelines/${uid}`);
  }


  deleteGuideline(uid:number,id: number): Observable<any> 
  {
    return this._HttpClient.delete(`${environment.baseUrl}/admin/delete-guidelines?universityId=${uid}&guidelineId=${id}`);
  }


  updateGuideline(uid:number,id: number, data: object): Observable<any>
  {
    return this._HttpClient.put(`${environment.baseUrl}/admin/edit/update-guidelines?universityId=${uid}&guidelineId=${id}`, data);
  }
}
