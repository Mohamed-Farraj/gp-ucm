import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrivilagesService {

    private privileges: Set<string> = new Set();

    private readonly _AuthService = inject(AuthService)

  constructor() {this.loadPrivileges();}


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
