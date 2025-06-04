import { Component, inject } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { HeroHelperComponent } from '../hero-helper/hero-helper.component';
import { RouterOutlet } from '@angular/router';
import { GuestNavComponent } from '../guest-nav/guest-nav.component';
import { GuestFooterComponent } from '../../guest-footer/guest-footer.component';
import { ApplicationDeadlineComponent } from '../application-deadline/application-deadline.component';
import { GuidlinesComponent } from '../guidlines/guidlines.component';
import { AcceptanceStatusComponent } from '../acceptance-status/acceptance-status.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-guest-home',
  standalone: true,
  imports: [
    RouterOutlet,
    GuestNavComponent,
    GuestFooterComponent,
    ApplicationDeadlineComponent,
    GuidlinesComponent,
    AcceptanceStatusComponent,
    HeroHelperComponent,
    HeroComponent,
    NgIf,
    AsyncPipe
],
  templateUrl: './guest-home.component.html',
  styleUrl: './guest-home.component.scss'
})
export class GuestHomeComponent {

     public readonly local = inject(LocalStorageService);
  

}
