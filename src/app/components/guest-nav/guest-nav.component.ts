import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
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

  
toggleMenu() {
this.isMenuCollapsed = !this.isMenuCollapsed;
}

}
