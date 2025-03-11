import { Component } from '@angular/core';
import { UserDashboardComponent } from '../../components/user-dashboard/user-dashboard.component';

@Component({
  selector: 'app-hu-layout',
  standalone: true,
  imports: [UserDashboardComponent],
  templateUrl: './hu-layout.component.html',
  styleUrl: './hu-layout.component.scss'
})
export class HuLayoutComponent {

}
