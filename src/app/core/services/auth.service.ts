import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _HttpClient = inject(HttpClient)

  setRegisterForm(data:object)
  {
   return this._HttpClient.post('http://localhost:8080/public/register' , data)
  }

}
