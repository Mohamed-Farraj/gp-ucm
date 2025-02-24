import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GuestNavComponent } from '../../components/guest-nav/guest-nav.component';
import { GuestFooterComponent } from '../../components/guest-footer/guest-footer.component';

@Component({
  selector: 'app-guest-layout',
  standalone: true,
  imports: [RouterOutlet,GuestNavComponent,GuestFooterComponent],
  templateUrl: './guest-layout.component.html',
  styleUrl: './guest-layout.component.scss'
})
export class GuestLayoutComponent {

}
