import { AfterViewInit, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { GuestNavComponent } from '../../components/guest-nav/guest-nav.component';
import { GuestFooterComponent } from '../../components/guest-footer/guest-footer.component';
import { ApplicationDeadlineComponent } from '../../components/application-deadline/application-deadline.component';
import { GuidlinesComponent } from '../../components/guidlines/guidlines.component';
import { AcceptanceStatusComponent } from "../../components/acceptance-status/acceptance-status.component";
import { HeroHelperComponent } from '../../components/hero-helper/hero-helper.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-guest-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    GuestNavComponent,
    GuestFooterComponent,
    ApplicationDeadlineComponent,
    GuidlinesComponent,
    AcceptanceStatusComponent,
    HeroHelperComponent,
    HeroComponent
],
  templateUrl: './guest-layout.component.html',
  styleUrl: './guest-layout.component.scss'
})
export class GuestLayoutComponent implements AfterViewInit,OnInit {

  constructor(private route: ActivatedRoute, private viewportScroller: ViewportScroller) {}
  private readonly platformId = inject(PLATFORM_ID);
  ngOnInit(): void {
      //AOS.init(); 
  }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('aos').then(AOS => {
        AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: false
        });
      });
    this.route.fragment.subscribe((fragment) => {
        if (fragment) {
            this.viewportScroller.scrollToAnchor(fragment);
        }
    });

}
}
}