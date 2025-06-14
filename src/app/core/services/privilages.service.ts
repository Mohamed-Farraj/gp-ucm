import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class PrivilagesService {

    private privileges: Set<string> = new Set();
    private readonly _HttpClient = inject(HttpClient)
    private readonly _AuthService = inject(AuthService)

  constructor() {this.loadPrivileges();}

    getUserPrivileges(id?:string):Observable<any>
    {
    return this._HttpClient.get(`${environment.baseUrl}/admin/privileges/user-privileges/${id}`);
    }

  setPrivileges() {
      this.getUserPrivileges(localStorage.getItem('Uid')!).subscribe((res: any) => {
        next: (res: any) => {
          console.log(res?.data);
          const privileges = res?.data?.map((p: any) => p?.name);
          localStorage.setItem('privileges', JSON.stringify(privileges));
          this.loadPrivileges();
        }
        error: (error: any) => {
          console.log(error);
        }
      })

    }

  loadPrivileges() {
    const saved = localStorage.getItem('privileges');
    if (saved) {
      this.privileges = new Set(JSON.parse(saved));
    }
  }

  hasPrivilege(priv: string): boolean {
    if(this._AuthService.getRole() === 'ADMIN')
    {
      return true
    }
    return this.privileges.has(priv);
  }

}
