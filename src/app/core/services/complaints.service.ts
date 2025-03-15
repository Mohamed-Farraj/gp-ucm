import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {

  private readonly http = inject(HttpClient);
  private token = localStorage.getItem('userToken');


   // إنشاء شكوى (User)
   createComplaint(userId: number, request:any): Observable<any> {
    const url = `${environment.baseUrl}/user/make-complaint/${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(url, request, { headers });
  }

  // جلب كل الشكاوى (Admin)
  getAllComplaints(): Observable<any> {
    const url = `${environment.baseUrl}/admin/get-all-complaints`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get(url, { headers: headers });
  }

  // جلب شكوى بواسطة المعرف (Admin)
  getComplaintById(id: number): Observable<any> {
    const url = `${environment.baseUrl}/admin/get-complaint/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get(url, { headers });
  }

  // تحديث شكوى بواسطة المعرف (User)
  updateComplaint(id: number, request: any): Observable<any> {
    const url = `${environment.baseUrl}/user/update-complaint/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put(url, request, { headers });
  }

  // حذف شكوى بواسطة المعرف (Admin)
  deleteComplaint(id: number): Observable<any> {
    const url = `${environment.baseUrl}/admin/delete-complaint/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.delete(url, { headers });
  }

  // جلب كل الشكاوى الخاصة بمستخدم معين (Admin)
  getComplaintsByUser(userId: number): Observable<any> {
    const url = `${environment.baseUrl}/admin/get-user-complaints/${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get(url, { headers });
  }
}
