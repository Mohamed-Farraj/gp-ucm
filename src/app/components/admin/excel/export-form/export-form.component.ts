// export-form.component.ts
import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../../../../core/services/excel.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-export-form',
  standalone: true,
  imports: [FormsModule,NgIf,NgFor,KeyValuePipe],
  templateUrl: './export-form.component.html',
  styleUrls: ['./export-form.component.scss']
})
export class ExportFormComponent implements OnInit {
  genders = [
    { value: 'MALE', label: 'ذكور' },
    { value: 'FEMALE', label: 'اناث' },
    { value: 'ALL', label: 'الكل' }
  ];

  penalties = [
    { value: true, label: 'لديه عقوبات' },
    { value: false, label: 'ليس لديه عقوبات' },
    { value: 'ALL', label: 'الكل' }
  ];

  statuses = [
    { value: 'UNDER_REVIEW', label: 'تحت المراجعة' },
    { value: 'REJECTED', label: 'مرفوض' },
    { value: 'ACCEPTED', label: 'مقبول' },
    { value: 'ALL', label: 'الكل' }
  ];

  securityCheck = [
    { value: 'PENDING', label: 'غير متوفر' },
    { value: 'REJECTED', label: 'مرفوض' },
    { value: 'ACCEPTED', label: 'مقبول' },
    { value: 'ALL', label: 'الكل' }
  ];



  readonly LEVEL_OPTIONS = [
    { value: 'first', label: 'الفرقة الاولى' },
    { value: 'second', label: 'الفرقة الثانية' },
    { value: 'third', label: 'الفرقة الثالثة' },
    { value: 'fourth', label: 'الفرقة الرابعة' },
    { value: 'fifth', label: 'الفرقة الخامسة' }
  ];

  columnHeaders: { [key: string]: string } = {
    ALL: "الاعمدة الافتراضية",
    fullName: "الاسم كامل",
    email: "البريد الالكتروني",
    universityName: "الجامعة",
    nationalId: "الرقم القومي",
    mobileNumber: "رقم الهاتف",
    faculty: "الكلية",
    level: "السنة الدراسية",
    dateOfBirth: "تاريخ الميلاد",
    studentType: "النوع",
    residenceAddress: "عنوان السكن",
    detailedAddress: "العنوان التفصيلي",
    placeOfBirth: "محل الميلاد",
    gender: "النوع",
    religion: "الديانه",
    fatherName: "اسم الاب",
    fatherNationalId: "الرقم القومى الاب",
    fatherOccupation: "وظيفه الاب",
    fatherPhoneNumber: "رقم هاتف الاب",
    guardianName: "اسم الوصي",
    guardianNationalId: "الرقم القومى الوصي",
    guardianPhoneNumber: "رقم هاتف الوصي",
    previousAcademicYearGpa: "المعدل التراكمي",
    status: "حاله الطلب",
    housingInPreviousYears: "السكن في السنوات السابقة",
    familyAbroad: "الأسرة في الخارج",
    specialNeeds: "ذوي الاحتياجات الخاصة",
    secondaryDivision: "المرحلة الثانوية",
    totalGradesHighSchool: "مجموع الثانوية العامة",
    passportNumber: "رقم الجواز",
    passportIssuingAuthority: "جهة إصدار الجواز",
    securityCheck: "الفحص الامني"
  };
  


  selectedStatus = 'ALL';
  selectedSecurityCheck = 'ALL';
  selectedGender = 'ALL';
  selectedPenalty = 'ALL';
  selectedFaculty: string = 'ALL';
  facultiesArray: string[] = [];
  selectedLevel = 'ALL';
  levelsArray: string = 'ALL';
  isDownloading = false;
  currentDate = "";
  selectedKey: string = 'ALL';
  selectedColumns: string[] = [];
  constructor(private excel:ExcelService ) { }


  addLevel() {
    if (this.selectedLevel === 'ALL') {
      this.levelsArray = 'ALL';
      return;
    }
  
    let currentLevels = this.levelsArray === 'ALL' ? [] : this.levelsArray.split(',');
  
    if (!currentLevels.includes(this.selectedLevel)) {
      currentLevels.push(this.selectedLevel);
      this.levelsArray = currentLevels.join(',');
    }
  
    this.selectedLevel = 'ALL'; // Reset selection
  }
  
  // دالة إزالة الفرقة
  removeLevel(levelToRemove: string) {
    if (this.levelsArray === 'ALL') return;
  
    let currentLevels = this.levelsArray.split(',');
    currentLevels = currentLevels.filter(l => l !== levelToRemove);
    
    this.levelsArray = currentLevels.length > 0 
      ? currentLevels.join(',') 
      : 'ALL';
  }
  
  // دالة لتحويل القيمة إلى تسمية
  getLevelLabel(levelValue: string): string {
    const levelsMap: {[key: string]: string} = {
      first: 'الفرقة الاولى',
      second: 'الفرقة الثانية',
      third: 'الفرقة الثالثة',
      fourth: 'الفرقة الرابعة',
      fifth: 'الفرقة الخامسة'
    };
    return levelsMap[levelValue] || levelValue;
  }

  addFaculty() {
    if (this.selectedFaculty === 'ALL') {
      this.facultiesArray = ['ALL'];
      return;
    }
  
    if (this.facultiesArray.includes('ALL')) {
      this.facultiesArray = [];
    }
  
    if (!this.facultiesArray.includes(this.selectedFaculty)) {
      console.log("this.facultiesArray",this.facultiesArray);
      this.facultiesArray = [...this.facultiesArray, this.selectedFaculty];
    }
  
    this.selectedFaculty = 'ALL';
  }


  
  removeFaculty(faculty: string) {
    this.facultiesArray = this.facultiesArray.filter(f => f !== faculty);
  }

  addColumn() {
    if (this.selectedKey === 'ALL') {
      this.selectedColumns = ['ALL'];
      return;
    }
  
    if (this.selectedColumns.includes('ALL')) {
      this.selectedColumns = [];
    }
  
    if (!this.selectedColumns.includes(this.selectedKey)) {
      this.selectedColumns = [...this.selectedColumns, this.selectedKey];
    }
  
    this.selectedKey = 'ALL';
  }


// دالة إزالة العمود
removeColumn(key: string) {
  const index = this.selectedColumns.indexOf(key);
  if (index > -1) {
    this.selectedColumns.splice(index, 1);
  }
}

// دالة مساعدة للحصول على مفاتيح الأعمدة
getColumnKeys(): string[] {
  return Object.keys(this.columnHeaders).filter(k => k !== 'ALL');
}
  
  // تغيير النوع إلى كائن لتتبع الحالات المختارة
  

  // دالة للتحقق من الحالة المختارة
  isSelected(statusValue: string): boolean {
    if (statusValue === 'ALL') {
      return this.selectedStatus === 'ALL';
    }
    return this.selectedStatus.split(',').includes(statusValue);
  }
  isSelectedSecurity(statusValue: string): boolean {
    if (statusValue === 'ALL') {
      return this.selectedSecurityCheck === 'ALL';
    }
    return this.selectedSecurityCheck.split(',').includes(statusValue);
  }

  // دالة معالجة التغيير
  onStatusChange(statusValue: string, event: any): void {
    const isChecked = event.target.checked;
    if (statusValue === 'ALL') {
      this.selectedStatus = isChecked ? 'ALL' : '';
    } else {
      let currentValues = this.selectedStatus === 'ALL' ? [] : this.selectedStatus.split(',');
      
      if (isChecked) {
        currentValues.push(statusValue);
      } else {
        currentValues = currentValues.filter(val => val !== statusValue);
      }
      
      this.selectedStatus = currentValues.join(',');
    }
  }
  onSecurityChange(securityValue: string, event: any): void {
    const isChecked = event.target.checked;
    if (securityValue === 'ALL') {
      this.selectedSecurityCheck = isChecked ? 'ALL' : '';
    } else {
      let currentValues = this.selectedSecurityCheck === 'ALL' ? [] : this.selectedSecurityCheck.split(',');
      
      if (isChecked) {
        currentValues.push(securityValue);
      } else {
        currentValues = currentValues.filter(val => val !== securityValue);
      }
      
      this.selectedSecurityCheck = currentValues.join(',');
    }
  }

  // دالة لإرسال البيانات
  getStatusForApi(): string {
    return this.selectedStatus;
  }


  ngOnInit(): void {


    console.log("this.selectedFaculty",this.selectedFaculty);
    console.log("this.selectedLevel",this.selectedLevel);
    console.log("this.selectedStatus",this.selectedStatus);
    console.log("this.selectedGender",this.selectedGender);


  }

  onDownload() {
    this.isDownloading = true;
    this.currentDate = new Date().toLocaleDateString();

    const facultyToSend = this.facultiesArray.join(',');
    const columnsToSend = this.selectedColumns.join(',');
    console.log("this.ؤخم",this.selectedColumns);
    console.log("this.selectedFaculties",this.facultiesArray);
    console.log("this.selectedFaculty",this.selectedFaculty);
    console.log("this.selectedLevel",this.selectedLevel);
    console.log("levelsArray",this.levelsArray);
    this.selectedLevel = this.levelsArray;
    console.log("this.selectedStatus",this.selectedStatus);
    console.log("this.selectedSecurityCheck",this.selectedSecurityCheck);
    console.log("this.selectedGender",this.selectedGender);
    console.log("this.selectedPenalty",this.selectedPenalty);
    this.excel.exportAdmissionRequests(this.selectedStatus,this.selectedSecurityCheck ,this.selectedGender,this.selectedPenalty,facultyToSend,columnsToSend,this.selectedLevel ).subscribe({
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