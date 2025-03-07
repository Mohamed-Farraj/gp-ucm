import { Component , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class HeroComponent {

   backgroundLinks: string[] = ["./assets/heroSlider/slider-0.png","./assets/heroSlider/slider-1.jpg","./assets/heroSlider/slider-2.jpg","./assets/heroSlider/slider-3.jpg"];
}
