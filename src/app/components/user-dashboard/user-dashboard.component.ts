import { Component } from '@angular/core';
import { UserNavbarComponent } from "../user-navbar/user-navbar.component";
import { UserLandingPageComponent } from "../user-landing-page/user-landing-page.component";

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [UserNavbarComponent, UserLandingPageComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {

}
