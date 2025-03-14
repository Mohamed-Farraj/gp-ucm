import { Component } from '@angular/core';
import { UserNavbarComponent } from "../user-navbar/user-navbar.component";
import { UserLandingPageComponent } from "../user-landing-page/user-landing-page.component";
import { RouterOutlet } from '@angular/router';
import { AcceptanceStatusComponent } from "../acceptance-status/acceptance-status.component";

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [UserNavbarComponent, UserLandingPageComponent, RouterOutlet, AcceptanceStatusComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {

}
