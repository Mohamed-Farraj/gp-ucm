import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {

private readonly _HttpClient = inject(HttpClient)


  constructor() { }

addUniversity(data:object):Observable<any>{

  return this._HttpClient.post(`${environment.baseUrl}/admin/edit/university` , data)

}

getAllUniversity():Observable<any>{

  return this._HttpClient.get(`${environment.baseUrl}/public/getAllUniversity`);  


}

deleteUniversity(id:number):Observable<any>{

  return this._HttpClient.delete(`${environment.baseUrl}/admin/deleteUniversity/${id}`);  

}


updateUniversity(id:number,data:object):Observable<any>{

  return this._HttpClient.put(`${environment.baseUrl}/admin/edit/update_university/${id}`,data);  

}
}