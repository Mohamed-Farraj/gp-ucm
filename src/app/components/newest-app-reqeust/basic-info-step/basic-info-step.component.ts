import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-basic-info-step',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './basic-info-step.component.html',
  styleUrl: './basic-info-step.component.scss'
})
export class BasicInfoStepComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  ngOnInit(): void {
    // فحص للتأكد من أن formGroup تم تمريره
    if (!this.formGroup) {
      console.error('FormGroup is not provided to BasicInfoStepComponent');
    }
  }

  get firstName() {
    return this.formGroup?.get('firstName');
  }
  get lastName() {
    return this.formGroup?.get('lastName');
  }

  get studentCode() {
    return this.formGroup?.get('studentCode');
  }
  get dateOfBirth() {
    return this.formGroup?.get('dateOfBirth');
  }
  get gender() {
    return this.formGroup?.get('gender');
  }
  get placeOfBirth() {
    return this.formGroup?.get('placeOfBirth');
  }
  get nationalId() {
    return this.formGroup?.get('nationalId');
  }
  get religion() {
    return this.formGroup?.get('religion');
  }











  selectedMedia: File[] = [];
  
  onMediaSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        this.selectedMedia.push(input.files[i]);
      }
    }
  }
  
  removeMedia(index: number): void {
    this.selectedMedia.splice(index, 1);
  }
  
  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }
  
  getFilePreview(file: File): string {
    return URL.createObjectURL(file);
  }
  
  uploadMedia(): void {
    // هنا يمكنك إرسال الملفات إلى الخادم
    const formData = new FormData();
    this.selectedMedia.forEach((file, index) => {
      formData.append(`media_${index}`, file);
    });
    
    // استدعاء الخدمة لرفع الملفات
    // this.mediaService.uploadFiles(formData).subscribe(response => {
    //   console.log('تم رفع الملفات بنجاح', response);
    // });
  }
}