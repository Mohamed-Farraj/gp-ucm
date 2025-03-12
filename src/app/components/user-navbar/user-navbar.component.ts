import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.scss'
})
export class UserNavbarComponent {
  @ViewChild('userNav') el!:ElementRef;

  @HostListener('window:scroll') onScroll(){
    if (window.scrollY > 80) {
      this.el.nativeElement.classList.remove('shadow-lg', 'additional-class');

  }

  else{
    this.el.nativeElement.classList.add('shadow-lg', 'additional-class');
  }
}
}
