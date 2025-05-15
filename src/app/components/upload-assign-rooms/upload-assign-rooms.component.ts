import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ExcelService } from '../../core/services/excel.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-upload-assign-rooms',
  standalone: true,
  imports: [NgIf,NgClass],
  templateUrl: './upload-assign-rooms.component.html',
  styleUrl: './upload-assign-rooms.component.scss'
})
export class UploadAssignRoomsComponent {
excel = inject(ExcelService);

  // Add these properties to your component class
isUploading = false;
uploadSuccess = false;
uploadStatus = '';

// أضف هذه الخاصية
isDragging = false;

allowedTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
  'application/vnd.ms-excel'
];



// دالة السحب فوق المنطقة
onDragOver(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  this.isDragging = true;
}

// دالة مغادرة المنطقة
onDragLeave(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  this.isDragging = false;
}

// دالة إفلات الملف
onFileDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  this.isDragging = false;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    this.handleFile(files[0]);
  }
}

// دالة معالجة الملف المشتركة
private handleFile(file: File) {
  if (!file) {
    this.setUploadStatus('لم يتم اختيار ملف', false);
    return;
  }

  if (!this.allowedTypes.includes(file.type)) {
    this.setUploadStatus('نوع الملف غير مسموح به. يرجى اختيار ملف Excel', false);
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    this.setUploadStatus('حجم الملف كبير جداً (الحد الأقصى 10MB)', false);
    return;
  }

  this.startUpload(file);
}

// دالة بدء الرفع
private startUpload(file: File) {
  this.isUploading = true;
  this.uploadStatus = '';

  const formData = new FormData();
  formData.append('file', file, file.name);

  this.excel.uploadAssignRoom(formData).subscribe({
    next: (response) => this.handleUploadSuccess(response),
    error: (err) => this.handleUploadError(err)
  });
}
// @Output() uploadCompleted = new EventEmitter<any>();
// معالجة النجاح
private handleUploadSuccess(response: any) {
  // this.uploadCompleted.emit(response);
  this.isUploading = false;
  this.uploadSuccess = true;
  this.uploadStatus = 'تم رفع الملف بنجاح';
  this.clearFileInput();
}

// معالجة الخطأ
private handleUploadError(err: any) {
  this.isUploading = false;
  this.uploadSuccess = false;
  this.uploadStatus = 'فشل الرفع: ' + (err.error?.message || 'حدث خطأ ما');
  console.error('Upload error:', err);
  this.clearFileInput();
}

// إعادة تعيين حالة الرفع
private setUploadStatus(message: string, isSuccess: boolean) {
  this.uploadStatus = message;
  this.uploadSuccess = isSuccess;
}

// مسح حقل الإدخال
private clearFileInput() {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
}


// Update your component class with this method
uploadFile(event: any) {
  const file = event.target.files?.[0];
  this.handleFile(file);
}

downloadDormTemp() {
  // Subscribe to the observable that downloads the template file
  this.excel.downloadAssignRoomsTemplate('18','DORM').subscribe({
    // Handle the response when it is received
    next: (response: Blob) => {
      // Create a link to download the file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(response);
      link.download = 'AssignDORMRoomsTemplate.xlsx';
      link.click();
    },
    // Handle any errors that occur
    error: (error: any) => {
      console.error('Error downloading template:', error);
    }
  });

}
downloadSingleTemp() {
  // Subscribe to the observable that downloads the template file
  this.excel.downloadAssignRoomsTemplate('18','SINGLE').subscribe({
    // Handle the response when it is received
    next: (response: Blob) => {
      // Create a link to download the file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(response);
      link.download = 'AssignSINGLERoomsTemplate.xlsx';
      link.click();
    },
    // Handle any errors that occur
    error: (error: any) => {
      console.error('Error downloading template:', error);
    }
  });

}

}
