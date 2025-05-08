import { Component, inject } from '@angular/core';
import { UserNavbarComponent } from "../user-navbar/user-navbar.component";
import { UserLandingPageComponent } from "../user-landing-page/user-landing-page.component";
import { RouterOutlet } from '@angular/router';
import { AcceptanceStatusComponent } from "../acceptance-status/acceptance-status.component";
import { AuthService } from '../../core/services/auth.service';
import { ArService } from '../../core/services/ar.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [UserNavbarComponent, UserLandingPageComponent, RouterOutlet, AcceptanceStatusComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {

  private readonly ar = inject(ArService)
  name:string ='';

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.ar.getArById(parseInt(localStorage?.getItem('Uid')!)||0).subscribe(
      {
        next: (res) => {
          console.log(res);
          this.name = res.data.firstName;
        },
        error: (err) => {
          console.log(err);
        }
      }
    )
  }


}
