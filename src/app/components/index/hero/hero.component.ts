import { Component , CUSTOM_ELEMENTS_SCHEMA, inject} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink,RouterLinkActive , NgClass ,NgIf, AsyncPipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class HeroComponent {

   backgroundLinks: string[] = ["./assets/heroSlider/slider-0.png","./assets/heroSlider/slider-1.jpg","./assets/heroSlider/slider-2.jpg","./assets/heroSlider/slider-3.jpg"];

   public readonly local = inject(LocalStorageService);

   addUniversity(u:string)
   {
     this.local.set('university',u);
   }
   changUni()
   {
     this.local.remove('university');
     console.log('uni removed');  
   }

}
