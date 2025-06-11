import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../services/guest/home.service';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

@Component({
  selector: 'app-guidlines',
  standalone: true,
  imports: [NgIf , NgSwitch , NgSwitchCase , NgSwitchDefault],
  templateUrl: './guidlines.component.html',
  styleUrl: './guidlines.component.scss'
})
export class GuidlinesComponent implements OnInit {


  constructor(private _HomeService:HomeService) { }
  res:any[] = [];

  ngOnInit():void {
    this._HomeService.getGuidlines().subscribe(
      {
        next: (res) => {console.log(res); this.res = res.data; console.log(this.res);},
        error: (err) => {console.log(err);},
      }
    );
  }

  getFileType(url: string): string {
  if (!url) return '';
  // الصور الشائعة
  if (url.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i)) {
    return 'image';
  }
  // PDF أو أي حاجة تانية
  return 'file';
}



}
