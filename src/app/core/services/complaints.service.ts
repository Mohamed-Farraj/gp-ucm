import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {

  private readonly http = inject(HttpClient);
  private token = "";


   // إنشاء شكوى (User)
   createComplaint(userId: number, request:any): Observable<any> {
     const url = `${environment.baseUrl}/user/make-complaint/${userId}`;
    // this.token = localStorage.getItem('userToken')!;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${this.token}`,
    //   'Content-Type': 'application/json'
    // });
    return this.http.post(url, request);
  }

  // جلب كل الشكاوى (Admin)
  getAllComplaints(): Observable<any> {
    const url = `${environment.baseUrl}/admin/view/get-all-complaints`;
    // this.token = localStorage.getItem('userToken')!;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${this.token}`
    // });
    return this.http.get(url);
  }

  // جلب شكوى بواسطة المعرف (Admin)
  getComplaintById(id: number): Observable<any> {
    const url = `${environment.baseUrl}/admin/view/get-complaint/${id}`;
    // this.token = localStorage.getItem('userToken')!;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${this.token}`
    // });
    return this.http.get(url);
  }

  // تحديث شكوى بواسطة المعرف (User)
  updateComplaint(id: number, request: any): Observable<any> {
    const url = `${environment.baseUrl}/user/update-complaint/${id}`;
    // this.token = localStorage.getItem('userToken')!;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${this.token}`,
    //   'Content-Type': 'application/json'
    // });
    return this.http.put(url, request);
  }

  // حذف شكوى بواسطة المعرف (Admin)
  deleteComplaint(id: number): Observable<any> {
    const url = `${environment.baseUrl}/admin/delete-complaint/${id}`;
    // this.token = localStorage.getItem('userToken')!;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${this.token}`
    // });
    return this.http.delete(url);
  }

  // جلب كل الشكاوى الخاصة بمستخدم معين (Admin)
  getComplaintsByUser(userId: number): Observable<any> {
    const url = `${environment.baseUrl}/admin/view/get-user-complaints/${userId}`;
    // this.token = localStorage.getItem('userToken')!;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${this.token}`
    // });
    return this.http.get(url);
  }
}
