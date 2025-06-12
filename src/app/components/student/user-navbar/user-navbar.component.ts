import { ArService } from './../../../core/services/ar.service';
import { Component, ElementRef, HostListener, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.scss'
})
export class UserNavbarComponent {
  @ViewChild('userNav') el!:ElementRef;
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService)
  private readonly platformId = inject(PLATFORM_ID);

  @HostListener('window:scroll') onScroll(){
    if (window.scrollY < 80) {
      this.el.nativeElement.classList.remove('shadow-lg', 'additional-class');

  }

  else{
    this.el.nativeElement.classList.add('shadow-lg', 'additional-class');
  }
}


navtoDetails(){
      if (isPlatformBrowser(this.platformId)) {
        const id =  localStorage.getItem('Uid') 
      if (id) {
              this.router.navigate(['hu/details', id]);
      }
}
}

logout(){
  this.auth.logout();
}

}
