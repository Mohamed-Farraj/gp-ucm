import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private http: HttpClient) { }

    exportAdmissionRequests(status: string, securityCheck: string, gender: string,penalty:string,faculty: string,level:string): Observable<Blob> {
      let apiUrl = `${environment.baseUrl}/admin/view/admission-requests/export`;
      let params = new HttpParams();
      if (status && status !== 'ALL') {
        params = params.append('status', status);
      }
      if (securityCheck && securityCheck !== 'ALL') {
        params = params.append('securityCheck', securityCheck);
      }
      if (gender && gender !== 'ALL') {
        params = params.append('gender', gender);
      }
      if (penalty !== 'ALL') {
        params = params.append('hasPenalty', penalty);
      }
      if (faculty && faculty !== 'ALL') {
        params = params.append('faculty', faculty);
      }
      if (level && level !== 'ALL') {
        params = params.append('level', level);
      }
      // if(status === 'ALL' && gender === 'ALL' && faculty === 'ALL'&& level === 'ALL')
      // {
      //   apiUrl = `${environment.baseUrl}/admin/view/export-admission-requests`;
      // }
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

    importAdmissionRequests(formData: FormData): Observable<any> {
 
      return this.http.post(`${environment.baseUrl}/admin/upload-admission-request`, formData,{
        reportProgress: true,
        observe: 'response'
      });
    }

    
    downloadTemplate(): Observable<Blob> {
      const apiUrl = `${environment.baseUrl}/admin/view/security-check/template`;
      return this.http.get(apiUrl, {
        responseType: 'blob',
        headers: new HttpHeaders({
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      }).pipe(
        catchError(error => {
          console.error('Error downloading template:', error);
          throw error;
        })
      );
    }

    downloadAssignRoomsTemplate(buildingType:string,RoomType:string): Observable<Blob> {
      const apiUrl = `${environment.baseUrl}/admin/view/room-assignment/export-available-rooms?buildingId=${buildingType}&roomType=${RoomType}`;
      return this.http.get(apiUrl, {
        responseType: 'blob',
        headers: new HttpHeaders({
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      }).pipe(
        catchError(error => {
          console.error('Error downloading template:', error);
          throw error;
        })
      );
    }


    uploadAssignRoom(formData: FormData): Observable<any> {
       return this.http.post(`${environment.baseUrl}/admin/edit/room-assignment/upload-student-housing-info`, formData,{
        reportProgress: true,
        observe: 'response'
      });
    }


  
}
