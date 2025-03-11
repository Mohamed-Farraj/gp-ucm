import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './admin-landing-page.component.html',
  styleUrl: './admin-landing-page.component.scss'
})
export class AdminLandingPageComponent {
@Input() data :any;
}
