import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrivilagesService {

    private privileges: Set<string> = new Set();

  constructor() {this.loadPrivileges();}


  loadPrivileges() {
    const saved = localStorage.getItem('privileges');
    if (saved) {
      this.privileges = new Set(JSON.parse(saved));
    }
  }

  hasPrivilege(priv: string): boolean {
    return this.privileges.has(priv);
  }

}
