import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _HttpClient = inject(HttpClient)
  userData:any = null

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
