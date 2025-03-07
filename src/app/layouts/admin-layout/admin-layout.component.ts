import { Component } from '@angular/core';
import { AdminDashboardComponent } from "../../components/admin-dashboard/admin-dashboard.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminDashboardComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}
