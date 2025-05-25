import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { SharedDataService } from './shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _HttpClient = inject(HttpClient)
  private readonly router = inject(Router)
  private readonly sharedDataService = inject(SharedDataService)
  public token: string = ""
    public userData: { 
    decodedToken?: any; 
    token?: string|null; 
    userId?: number; 
    email?: string;
    userRole?:string;
  } = {};


    
  
  getApplications(currentPage?:number):Observable<any>
  {
    let params = new HttpParams();
    params = params.append('offset', currentPage || 0);  
    params = params.append('limit', 20);
  return this._HttpClient.get(`${environment.baseUrl}/admin/view/admission-requests`,{params});
  }


  DecideArState(UId:number,Status:string,message?:string):Observable<any>{
    const url = `${environment.baseUrl}/admin/edit/admission-requests/${UId}/status?status=${Status}`
    let Body = {}
    if(Status !== 'REJECTED')
    {
      Body = 
      {
        admissionStatusNotes: Status
       }
    }
    else
    {
      Body = 
      {
        admissionStatusNotes: message
       }
    }
    return this._HttpClient.put(url,Body);
  }


  setRegisterForm(data:object):Observable<any>
  {
   return this._HttpClient.post(`${environment.baseUrl}/public/register` , data)
  }
  setLoginForm(data:object):Observable<any>
  {
   return this._HttpClient.post(`${environment.baseUrl}/public/login` , data)
  }

  setResetPassword(data:object):Observable<any>
  {
   return this._HttpClient.post(`${environment.baseUrl}/public/reset-password` , data)
  }


 setForgotPassword(data:object):Observable<any>
  {
   return this._HttpClient.post(`${environment.baseUrl}/public/forgot-password` , data)
  }


  






  logout(){
    localStorage.removeItem('userToken')
    localStorage.removeItem('role')
    localStorage.removeItem('Uid')
    this.userData = {}
    this.sharedDataService.clearUserData();
    console.log('logging out...');
    this.router.navigate(['/'])
  }


  getRole()
  {
    return localStorage?.getItem('role')
  }

  saveUserData(input:any){
    if(localStorage.getItem('userToken') !== null){
    this.userData.decodedToken=  jwtDecode(localStorage.getItem('userToken')!)
    this.token = input.token;
    this.userData.token =  input.token;
    this.userData.userId = input.userID;
    this.userData.email = input.username;
    this.userData.userRole = input.role;
    console.log('saveUserData userToken', this.userData);
    this.sharedDataService.setUserData(this.userData);
    }

  }
}
