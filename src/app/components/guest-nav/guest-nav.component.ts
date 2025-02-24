import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-guest-nav',
  standalone: true,
  imports: [NgClass],
  templateUrl: './guest-nav.component.html',
  styleUrl: './guest-nav.component.scss'
})
export class GuestNavComponent {
  isMenuCollapsed = true;

  
toggleMenu() {
this.isMenuCollapsed = !this.isMenuCollapsed;
}

}
