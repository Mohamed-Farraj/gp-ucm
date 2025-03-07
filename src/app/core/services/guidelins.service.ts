import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuidelinsService {

  private readonly _HttpClient = inject(HttpClient)
  myheaders:any ={token: "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb2hhbWVkbW9oYW1lZEBnbWFpbC5jb20iLCJpYXQiOjE3NDEyOTk2MDgsImV4cCI6MTc0MTM4NjAwOH0.hcusQch227py8OkB-HTEfHAl-T9cI1LCNgirlo5vD39ooAFYSTgwr71ggcJABA0L"}


  setguideForm(data:object)
  {
   return this._HttpClient.post('http://localhost:8080/admin/add-guidelines/1' , data , 

    {
      headers:this.myheaders
    }


   )
 
  }
 

}
