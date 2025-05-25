import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../services/guest/home.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-application-deadline',
  standalone: true,
  imports: [NgIf],
  templateUrl: './application-deadline.component.html',
  styleUrl: './application-deadline.component.scss'
})
export class ApplicationDeadlineComponent implements OnInit  {

  constructor(private _HomeService : HomeService) { }
  res:any[] = [];

  ngOnInit(): void {
    this._HomeService.getDeadline().subscribe({
      next: (res) => {console.log(res); this.res = res.data; console.log(this.res);},
      error: (err) => {console.log(err);},
    });
  }

}
