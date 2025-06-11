import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuidelinsService {

  private readonly _HttpClient = inject(HttpClient)


 setguideForm(uid: number, data: FormData): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/admin/add-guidelines/${uid}`, data);
  }

  // جلب الإرشادات (عادي GET)
  getGuidelines(uid: number = 1): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/public/get-guidelines/${uid}`);
  }

  // حذف إرشادات (عادي DELETE)
  deleteGuideline(uid: number, id: number): Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}/admin/delete-guidelines?universityId=${uid}&guidelineId=${id}`);
  }

  // تعديل إرشادات (لو فيها ميديا برضو FormData - والطريقة لازم تكون PUT أو POST حسب اللي في الباك)
  updateGuideline(uid: number, id: number, data: FormData): Observable<any> {
    // ملاحظة: خلي بالك من الـ URL لازم يكون ? بدل =
    return this._HttpClient.put(
      `${environment.baseUrl}/admin/update-guidelines?universityId=${uid}&guidelineId=${id}`, 
      data
    );
  }
}
