import { environment } from './../../../../.history/src/app/core/environments/environment_20250311113040';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _HttpClient = inject(HttpClient)
  private readonly router = inject(Router)
  public token: string = ""
    public userData: { 
    decodedToken?: any; 
    token?: string|null; 
    userId?: number; 
    email?: string;
    userRole?:string;
  } = {};

  
  getApplications()
  {
  return this._HttpClient.get(`${environment.baseUrl}/admin/admission-requests`, { 
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
      'Content-Type': 'application/json'
    })
  });
  }

  DecideArState(UId:number,Status:string){
    return this._HttpClient.put(`http://localhost:8080/admin/admission-requests/${UId}/status?status=${Status}`,
      null,
      {headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        'Content-Type': 'application/json',
      }),    
      withCredentials: true 
    },
        );
  }

  setRegisterForm(data:object):Observable<any>
  {
   return this._HttpClient.post('http://localhost:8080/public/register' , data)
  }
  setLoginForm(data:object):Observable<any>
  {
   return this._HttpClient.post('http://localhost:8080/public/login' , data)
  }




  saveUserData(){
    if(localStorage.getItem('userToken') !== null){
    this.userData=  jwtDecode(localStorage.getItem('userToken')!)
    }
  }
}
