import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _HttpClient = inject(HttpClient)
  userData:any = null

  
  getApplications()
  {

  return this._HttpClient.get('http://localhost:8080/admin/admission-requests', { 
    headers: new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb2hhbWVkbW9oYW1lZEBnbWFpbC5jb20iLCJpYXQiOjE3NDEyMjE0NTgsImV4cCI6MTc0MTMwNzg1OH0.KSBd03o3qXBsMXoicjwqjEJnZ_lFS2odRpJnMPllWiatDT0ANoyDmDhRvVfg_mPr',
      'Content-Type': 'application/json'
    })
  });
  }

  DecideArState(UId:number,Status:string){
    return this._HttpClient.put(`http://localhost:8080/admin/admission-requests/${UId}/status?status=${Status}`,
      null,
      {headers: new HttpHeaders({
        'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb2hhbWVkbW9oYW1lZEBnbWFpbC5jb20iLCJpYXQiOjE3NDEyMjE0NTgsImV4cCI6MTc0MTMwNzg1OH0.KSBd03o3qXBsMXoicjwqjEJnZ_lFS2odRpJnMPllWiatDT0ANoyDmDhRvVfg_mPr',
        'Content-Type': 'application/json'
      })}
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
