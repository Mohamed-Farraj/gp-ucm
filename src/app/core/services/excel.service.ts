import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private http: HttpClient) { }

    exportAdmissionRequests(status: string, gender: string): Observable<Blob> {
      let apiUrl = 'http://localhost:8080/admin/view/admission-requests/export';
      let params = new HttpParams();
      if (status && status !== 'ALL') {
        params = params.append('status', status);
      }
      if (gender && gender !== 'ALL') {
        params = params.append('gender', gender);
      }
      if(status === 'ALL' && gender === 'ALL')
      {
        apiUrl = 'http://localhost:8080/admin/view/export-admission-requests';
      }
      return this.http.get(apiUrl, {
        params: params,
        responseType: 'blob',
        headers: new HttpHeaders({
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      }).pipe(
        catchError(error => {
          console.error('Error downloading file:', error);
          throw error;
        })
      );
    }
  
}
