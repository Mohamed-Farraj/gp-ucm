import { Component } from '@angular/core';
import { UserDashboardComponent } from '../../components/user-dashboard/user-dashboard.component';
import { UserNavbarComponent } from "../../components/user-navbar/user-navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-hu-layout',
  standalone: true,
  imports: [UserDashboardComponent, UserNavbarComponent,RouterOutlet],
  templateUrl: './hu-layout.component.html',
  styleUrl: './hu-layout.component.scss'
})
export class HuLayoutComponent {

}
