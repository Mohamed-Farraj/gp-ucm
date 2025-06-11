import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppealsService {


  constructor() { }

  private readonly http = inject(HttpClient);

   createAppeal(userId: number, request:any): Observable<any> {
       const url = `${environment.baseUrl}/user/submit-appeal/${userId}`;
      // this.token = localStorage.getItem('userToken')!;
      // const headers = new HttpHeaders({
      //   'Authorization': `Bearer ${this.token}`,
      //   'Content-Type': 'application/json'
      // });
      return this.http.post(url, request);
    }
  
    // جلب كل الشكاوى (Admin)
    getAllAppeals(): Observable<any> {
      const url = `${environment.baseUrl}/admin/view/appeals`;
      // this.token = localStorage.getItem('userToken')!;
      // const headers = new HttpHeaders({
      //   'Authorization': `Bearer ${this.token}`
      // });
      return this.http.get(url);
    }
  
    // جلب شكوى بواسطة المعرف (Admin)
    getAppealById(id: number): Observable<any> {
      const url = `${environment.baseUrl}/admin/view/appeals/${id}`;
      // this.token = localStorage.getItem('userToken')!;
      // const headers = new HttpHeaders({
      //   'Authorization': `Bearer ${this.token}`
      // });
      return this.http.get(url);
    }
  
    // تحديث شكوى بواسطة المعرف (User)
   updateAppealStatus(id: number, status: string): Observable<any> {
  const url = `${environment.baseUrl}/admin/edit/update-appeal-status/${id}`;
  const params = new HttpParams().set('status', status);

  return this.http.put(url, {}, { params });
}
  
    // حذف شكوى بواسطة المعرف (Admin)
    deleteAppeal(id: number): Observable<any> {
      const url = `${environment.baseUrl}/user/delete-appeal/${id}`;
      // this.token = localStorage.getItem('userToken')!;
      // const headers = new HttpHeaders({
      //   'Authorization': `Bearer ${this.token}`
      // });
      return this.http.delete(url);
    }
  
    // جلب كل الشكاوى الخاصة بمستخدم معين (Admin)
    checkAppealStatus(userId: number): Observable<any> {
      const url = `${environment.baseUrl}/user/appeal-status/${userId}`;
      return this.http.get(url);
    }
  
    getMyAppeal(userId: number): Observable<any> {
      const url = `${environment.baseUrl}/user/my-appeals/${userId}`;
      return this.http.get(url);
    }
}
