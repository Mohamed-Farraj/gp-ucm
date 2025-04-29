import { ArService } from './../../core/services/ar.service';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
  @HostListener('window:scroll') onScroll(){
    if (window.scrollY < 80) {
      this.el.nativeElement.classList.remove('shadow-lg', 'additional-class');

  }

  else{
    this.el.nativeElement.classList.add('shadow-lg', 'additional-class');
  }
}




logout(){
  this.auth.logout();
}

}
