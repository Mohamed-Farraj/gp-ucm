import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-helper',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero-helper.component.html',
  styleUrl: './hero-helper.component.scss'
})
export class HeroHelperComponent {

}
