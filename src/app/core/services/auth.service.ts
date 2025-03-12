import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _HttpClient = inject(HttpClient)
  private token: string = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzb3NvQGdtYWlsLmNvbSIsImlhdCI6MTc0MTU3NzAzNywiZXhwIjoxNzQxNjYzNDM3fQ.kztdjWcjDtggKJpkVYNv3cAwNmkxTJxehOdozcdagt-SlSecdfJcLNSIy0fEUwJI"
  userData:any = null

  
  getApplications()
  {

  return this._HttpClient.get('http://localhost:8080/admin/admission-requests', { 
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    })
  });
  }

  DecideArState(UId:number,Status:string){
    return this._HttpClient.put(`http://localhost:8080/admin/admission-requests/${UId}/status?status=${Status}`,
      null,
      {headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
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
