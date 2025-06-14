import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import * as AOS from 'aos';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None, // or ViewEncapsulation.ShadowDom

})
export class AppComponent {
  title = 'gp-ucm';
  ngOnInit(): void {
  AOS.init({
    once: false,      // خليها حسب ما تحب: false = يكرر عند كل scroll, true = مرة واحدة
    startEvent: 'DOMContentLoaded', // يخليه يبدأ بعد تحميل الصفحة
    duration: 800,     // مدة الـ animation
    easing: 'ease-in-out' // شكل الحركة
  });

  // أضمن إنه يعمل refresh بعد ما Angular يرندر
  setTimeout(() => {
    AOS.refresh();
  }, 100);
}
}
