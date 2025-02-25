import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GuestNavComponent } from '../../components/guest-nav/guest-nav.component';
import { GuestFooterComponent } from '../../components/guest-footer/guest-footer.component';
import { ApplicationDeadlineComponent } from '../../components/application-deadline/application-deadline.component';
import { GuidlinesComponent } from '../../components/guidlines/guidlines.component';
import { AcceptanceStatusComponent } from "../../components/acceptance-status/acceptance-status.component";

@Component({
  selector: 'app-guest-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    GuestNavComponent,
    GuestFooterComponent,
    ApplicationDeadlineComponent,
    GuidlinesComponent,
    AcceptanceStatusComponent
],
  templateUrl: './guest-layout.component.html',
  styleUrl: './guest-layout.component.scss'
})
export class GuestLayoutComponent {

}
