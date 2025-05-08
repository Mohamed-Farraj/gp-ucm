import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './user-landing-page.component.html',
  styleUrl: './user-landing-page.component.scss'
})
export class UserLandingPageComponent {

  @Input() user: string = '';

}
