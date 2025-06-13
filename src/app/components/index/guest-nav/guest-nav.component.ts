import { NgClass, NgIf, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-guest-nav',
  standalone: true,
  imports: [NgIf,NgClass,RouterLink,RouterLinkActive],
  templateUrl: './guest-nav.component.html',
  styleUrl: './guest-nav.component.scss'
})
export class GuestNavComponent implements OnInit {
  isMenuCollapsed = true;
  isLoggedIn = false;
  role = '';
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
   readonly auth = inject(AuthService)
  @ViewChild('guestNav') el!:ElementRef;


  ngOnInit(): void {

    if (isPlatformBrowser(this._PLATFORM_ID)) {

             this.handleScrollOrResize();


      if (localStorage.getItem('userToken')) {
        this.isLoggedIn = true;
        this.role = localStorage.getItem('role') || '';
      }
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll') 
  onScroll(){
      this.handleScrollOrResize();
}

private handleScrollOrResize(): void {
  if (!this.el) return;

  const isMobileOrTablet = window.innerWidth <= 991;
  if (window.scrollY > 80 || isMobileOrTablet) {
    this.el.nativeElement.classList.remove('scrolled', 'additional-class');
  } else {
    this.el.nativeElement.classList.add('scrolled', 'additional-class');
  }
}

toggleMenu() {
this.isMenuCollapsed = !this.isMenuCollapsed;
}

loggout(){
  this.auth.logout();
  this.isLoggedIn = false;
  this.role = '';
}



}
