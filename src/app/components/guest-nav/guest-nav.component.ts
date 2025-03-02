import { NgClass } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-guest-nav',
  standalone: true,
  imports: [NgClass,RouterLink,RouterLinkActive],
  templateUrl: './guest-nav.component.html',
  styleUrl: './guest-nav.component.scss'
})
export class GuestNavComponent {
  isMenuCollapsed = true;
  @ViewChild('guestNav') el!:ElementRef;
  @HostListener('window:scroll') onScroll(){
    if (window.scrollY > 200) {
      this.el.nativeElement.classList.remove('scrolled', 'additional-class');

  }

  else{
    this.el.nativeElement.classList.add('scrolled', 'additional-class');
  }
}
toggleMenu() {
this.isMenuCollapsed = !this.isMenuCollapsed;
}

}
