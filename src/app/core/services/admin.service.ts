import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly _HttpClient = inject(HttpClient)

  constructor() { }

createAdminAcc(data:object):Observable<any>{

  return this._HttpClient.post(`${environment.baseUrl}/public/register` , data)

}


}
