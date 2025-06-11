import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-hero-helper',
  standalone: true,
  imports: [RouterLink,NgIf,AsyncPipe],
  templateUrl: './hero-helper.component.html',
  styleUrl: './hero-helper.component.scss'
})
export class HeroHelperComponent {
   public readonly local = inject(LocalStorageService);

}
