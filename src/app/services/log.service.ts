import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../core/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }

  getLogs() {
    return this.http.get(`${environment.baseUrl}/admin/edit/get-logs`);
  }


}
