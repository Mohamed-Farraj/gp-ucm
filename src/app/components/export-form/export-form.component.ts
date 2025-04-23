// export-form.component.ts
import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../../core/services/excel.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-export-form',
  standalone: true,
  imports: [FormsModule,NgIf,NgFor],
  templateUrl: './export-form.component.html',
  styleUrls: ['./export-form.component.scss']
})
export class ExportFormComponent implements OnInit {
  genders = [
    { value: 'MALE', label: 'ذكور' },
    { value: 'FEMALE', label: 'اناث' },
    { value: 'ALL', label: 'الكل' }
  ];

  statuses = [
    { value: 'UNDER_REVIEW', label: 'تحت المراجعة' },
    { value: 'REJECTED', label: 'المرقوض' },
    { value: 'ACCEPTED', label: 'مقبول' },
    { value: 'ALL', label: 'الكل' }
  ];

  selectedGender = 'ALL';
  selectedStatus = 'ALL';
  isDownloading = false;
  currentDate = "";
  constructor(private excel:ExcelService ) { }

  ngOnInit(): void {

  }

  onDownload() {
    this.isDownloading = true;
    this.currentDate = new Date().toLocaleDateString();
    console.log("this.selectedStatus",this.selectedStatus);
    console.log("this.selectedGender",this.selectedGender);
    this.excel.exportAdmissionRequests(this.selectedStatus ,this.selectedGender ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.selectedStatus === 'ALL' ? '' : this.selectedStatus} ${this.selectedGender === 'ALL' ? '' : this.selectedGender} admission_requests_${this.currentDate}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isDownloading = false;
      },
      error: (err) => {
        console.error('Download failed:', err);
        this.isDownloading = false;
      }
    });
  }
}