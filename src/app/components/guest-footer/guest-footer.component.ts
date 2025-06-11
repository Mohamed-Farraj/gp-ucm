import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-guest-footer',
  standalone: true,
  imports: [RouterLinkActive,RouterLink],
  templateUrl: './guest-footer.component.html',
  styleUrl: './guest-footer.component.scss'
})
export class GuestFooterComponent {

}
