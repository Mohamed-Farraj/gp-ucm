import { Component, signal, WritableSignal, computed, Signal, inject, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ArService } from '../../../core/services/ar.service';
import { AuthService } from '../../../core/services/auth.service';
import countries from '../../../../assets/country (1).json';
import rawGovernorates from '../../../../assets/cities (1).json';
import rawCities from '../../../../assets/states (1).json';
import { BasicInfoStepComponent } from "../../newest-app-reqeust/basic-info-step/basic-info-step.component";
import { FamilyInfoStepComponent } from "../../newest-app-reqeust/family-info-step/family-info-step.component";
import { AcademicInfoStepComponent } from "../../newest-app-reqeust/academic-info-step/academic-info-step.component";
import { ContactInfoStepComponent } from "../../newest-app-reqeust/contact-info-step/contact-info-step.component";
import { AccountSetupStepComponent } from "../../newest-app-reqeust/account-setup-step/account-setup-step.component";
import { MatStepperModule } from '@angular/material/stepper';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-application-request',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatStepperModule, BasicInfoStepComponent, FamilyInfoStepComponent, AcademicInfoStepComponent, ContactInfoStepComponent, AccountSetupStepComponent],
  templateUrl: './application-request.component.html',
  styleUrl: './application-request.component.scss'
})
export class ApplicationRequestComponent implements OnInit {
  Toast = Swal.mixin({
    toast: true,
    position: 'top',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  private readonly _AuthService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ArService = inject(ArService);
  errmsg: string = '';
  isEditMode = false;
  showPasswordFields = true;
  studentType: 'old' | 'new' | null = null;
  activeButton: 'old' | 'new' | null = null;
  pendingFaculty: string | null = null;

  // FormGroups لكل خطوة
  personalInfoGroup: FormGroup;
  familyInfoGroup: FormGroup;
  academicInfoGroup: FormGroup;
  contactInfoGroup: FormGroup;
  accountSetupGroup: FormGroup;
  AppRequest: FormGroup;

  // قائمة محافظات مصر مع أكوادها في الرقم القومي
  governoratesCodes: { [key: string]: string } = {
    '01': 'القاهرة', '02': 'الاسكندريه', '03': 'بورسعيد', '04': 'السويس',
    '11': 'دمياط', '12': 'الدقهلية', '13': 'الشرقيه', '14': 'القليوبيه',
    '15': 'كفرالشيخ', '16': 'الغربيه', '17': 'المنوفيه', '18': 'البحيرة',
    '19': 'الاسماعيلية', '21': 'الجيزه', '22': 'بني سويف', '23': 'الفيوم',
    '24': 'المنيا', '25': 'اسيوط', '26': 'سوهاج', '27': 'قنــا', '28': 'اسوان',
    '29': 'الاقصـر', '31': 'البحر الاحمر', '32': 'الوادي الجديد', '33': 'مرسي مطروح',
    '34': 'شمال سيناء', '35': 'جنوب سيناء', '88': 'خارج مصر'
  };

  // الكليات التي لديها 5 فرق دراسية
  fiveYearFaculties: string[] = ['كلية الفنون والفنون التطبيقية', 'كلية طب الأسنان' ,'كلية الهندسة', 'كلية العلاج الطبيعي' , 'كلية الهندسة بالمطرية', 'كلية الهندسة بحلوان', 'كلية الطب'];
  facultySelected: WritableSignal<string | null> = signal(null);
  levels: Signal<{ value: string; label: string }[]> = computed(() => {
    const faculty = this.facultySelected();
    if (faculty && this.fiveYearFaculties.includes(faculty)) {
      return [
        { value: 'first', label: 'الأولى' }, { value: 'second', label: 'الثانية' },
        { value: 'third', label: 'الثالثة' }, { value: 'fourth', label: 'الرابعة' },
        { value: 'fifth', label: 'الخامسة' }
      ];
    }
    return [
      { value: 'first', label: 'الأولى' }, { value: 'second', label: 'الثانية' },
      { value: 'third', label: 'الثالثة' }, { value: 'fourth', label: 'الرابعة' }
    ];
  });


nameOfUniversities = [
  { value: '1', label: 'جامعة حلوان' },
  { value: '2', label: 'جامعه حلوان الاهلية' },
  { value: '3', label: 'جامعه حلوان التكنولوجية' }
];

facultiesMap = {
  '1': [
    'كلية الآداب',
    'كلية الاقتصاد المنزلي',
    'كلية التربية',
    'كلية التمريض',
    'كلية الحاسبات والذكاء الاصطناعي',
    'كلية الخدمة الاجتماعية',
    'كلية الصيدلة',
    'كلية الطب',
    'كلية العلاج الطبيعي',
    'كلية العلوم',
    'كلية الفنون التطبيقية',
    'كلية الفنون الجميلة',
    'كلية التربية الرياضية بنين',
    'كلية التربية الرياضية بنات',
    'كلية الهندسة بالمطرية',
    'كلية الهندسة بحلوان',
    'كلية التجارة وإدارة الأعمال',
    'كلية الحقوق',
    'كلية التربية الموسيقية',
    'كلية التربية الفنية',
    'كلية السياحة والفنادق',
    'كلية التعليم الصناعي',
    'المعهد القومي للملكية الفكرية'
  ],
  '2': [
    'كلية العلاج الطبيعي',
    'كلية العلوم',
    'كلية العلوم الإنسانية والتجارة وإدارة الأعمال',
    'كلية الفنون والفنون التطبيقية',
    'كلية الهندسة',
    'كلية تكنولوجيا العلوم الصحية التطبيقية',
    'كلية طب الأسنان',
    'كلية علوم الحاسب وتكنولوجيا المعلومات'
  ],
  '3': [
    'كلية تكنولوجيا الصناعة والطاقة'
  ]
};

faculties: string[] = []; // هتتغير حسب اختيار الجامعة



  countries = countries;
  selectedCountry: WritableSignal<string | null> = signal(null);
  selectedGovernorate: WritableSignal<string | null> = signal(null);
  governorates = rawGovernorates.find(entry => entry.type === 'table' && entry.name === 'governorates')?.data || [];
  filteredGovernorates: Signal<any[]> = computed(() => {
    return this.selectedCountry() === "EG" ? this.governorates.filter(gov => gov.countryCode === "EG") : [];
  });
  cities = rawCities.find(entry => entry.type === 'table' && entry.name === 'cities')?.data || [];
  filteredCities: Signal<any[]> = computed(() => {
    const govId = this.selectedGovernorate();
    return govId ? this.cities.filter(city => city.governorate_id === govId) : [];
  });

  isMobile = window.innerWidth < 768;

  constructor(private fb: FormBuilder) {
    // تهيئة FormGroups لكل خطوة
    this.personalInfoGroup = this.fb.group({
      firstName: [null, [Validators.required ,   Validators.pattern(/^[\u0600-\u06FFa-zA-Z\s\-']+$/),
    (control: AbstractControl) => (control.value || '').trim().length === 0 ? { whitespace: true } : null]],
      lastName: [null, [Validators.required,   Validators.pattern(/^[\u0600-\u06FFa-zA-Z\s\-']+$/),
    (control: AbstractControl) => (control.value || '').trim().length === 0 ? { whitespace: true } : null]],
      studentCode: [null, Validators.required],
      nationalId: [null, [Validators.required, Validators.pattern(/^\d{14}$/)]],
      dateOfBirth: [null, Validators.required],
      gender: [null, Validators.required],
      religion: [null, Validators.required],
      placeOfBirth: [null, Validators.required],
    });

    this.familyInfoGroup = this.fb.group({
      fatherName: [null, [Validators.required ,   Validators.pattern(/^[\u0600-\u06FFa-zA-Z\s\-']+$/),
    (control: AbstractControl) => (control.value || '').trim().length === 0 ? { whitespace: true } : null]],
      fatherNationalId: [null, [Validators.required, Validators.pattern(/^\d{14}$/)]],
      fatherOccupation: [null, Validators.required],
      fatherPhoneNumber: [null, [Validators.required ,  Validators.pattern(/^01[0-25]\d{8}$/)]],
      guardianName: [null, [Validators.required ,   Validators.pattern(/^[\u0600-\u06FFa-zA-Z\s\-']+$/),
    (control: AbstractControl) => (control.value || '').trim().length === 0 ? { whitespace: true } : null]],
      guardianRelationship: [null, Validators.required],
      guardianNationalId: [null, [Validators.required, Validators.pattern(/^\d{14}$/)]],
      guardianPhoneNumber: [null, [Validators.required ,  Validators.pattern(/^01[0-25]\d{8}$/)] ],
      parentsStatus: [null, Validators.required],
      familyAbroad: [null],
      media: [null]
    });

    this.academicInfoGroup = this.fb.group({
      universityId: [null , Validators.required],
      faculty: [null, Validators.required],
      level: [null, Validators.required],
      previousAcademicYearGpa: [null],
      totalGradesHighSchool: [null],
      annualGrade: [null],
      wantFood: [''],
      secondaryDivision: [null],
      housingInPreviousYears: [null],
      houseTypeName: [null],
    });

    this.contactInfoGroup = this.fb.group({
      mobileNumber: [null, [Validators.required, Validators.pattern(/^01[0-25]\d{8}$/)]],
      phoneNumber: [null , [ Validators.pattern(/^0[2-9]\d{1,2}\d{6,7}$/)]] ,
      residenceAddress: [null, Validators.required],
      detailedAddress: [null, Validators.required],
      country: [null],
      governorate: [null],
      city: [null]
    });

    this.accountSetupGroup = this.fb.group({
      username: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      rePassword: [null, Validators.required],
      role: ['USER'],
      status: [2],
      securityCheck: ['PENDING'],
      confirmDataAccuracy: [true, Validators.requiredTrue]
    }, { validators: this.passwordConfirmation.bind(this) });

    // النموذج الكامل
    this.AppRequest = this.fb.group({
      personalInfo: this.personalInfoGroup,
      familyInfo: this.familyInfoGroup,
      academicInfo: this.academicInfoGroup,
      contactInfo: this.contactInfoGroup,
      accountSetup: this.accountSetupGroup
    });

    // استمع لتغييرات الكلية
    this.academicInfoGroup.get('faculty')?.valueChanges.subscribe(faculty => {
      this.facultySelected.set(faculty);
      this.academicInfoGroup.get('level')?.setValue(null);
    });

    // استمع لتغييرات الدولة والمحافظة والمدينة
    this.contactInfoGroup.get('country')?.valueChanges.subscribe(country => {
      this.selectedCountry.set(country);
      this.contactInfoGroup.get('governorate')?.setValue(null);
      this.contactInfoGroup.get('city')?.setValue(null);
      this.contactInfoGroup.get('residenceAddress')?.setValue(null);
    });
    this.contactInfoGroup.get('governorate')?.valueChanges.subscribe(governorate => {
      this.selectedGovernorate.set(governorate);
      this.contactInfoGroup.get('city')?.setValue(null);
      this.updateResidenceAddress();
    });
    this.contactInfoGroup.get('city')?.valueChanges.subscribe(() => {
      this.updateResidenceAddress();
    });

    // استمع لتغييرات الرقم القومي
    this.personalInfoGroup.get('nationalId')?.valueChanges.subscribe(nationalId => {
      if (nationalId && nationalId.length === 14) {
        this.extractDataFromNationalId(nationalId);
      }
    });

    // استمع لتغييرات الرقم القومي للأب
    this.familyInfoGroup.get('fatherNationalId')?.valueChanges.subscribe(fatherNationalId => {
      if (fatherNationalId && fatherNationalId.length === 14) {
        this.extractFatherDataFromNationalId(fatherNationalId);
      }
    });

    // استمع لتغييرات كلمة المرور
    this.accountSetupGroup.get('password')?.valueChanges.subscribe(() => {
      this.accountSetupGroup.get('rePassword')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = window.innerWidth < 768;
  }

  passwordConfirmation(g: AbstractControl) {
    if (!g.get('password')?.value || g.get('password')?.value === '') {
      return null;
    }
    return g.get('password')?.value === g.get('rePassword')?.value ? null : { mismatch: true };
  }



  selectedFile: File | null = null;

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}







  extractDataFromNationalId(nationalId: string) {
    if (nationalId && nationalId.length === 14) {
      try {
        const century = nationalId.charAt(0) === '2' ? '19' : '20';
        const year = century + nationalId.substring(1, 3);
        const month = nationalId.substring(3, 5);
        const day = nationalId.substring(5, 7);
        const dateOfBirth = `${year}-${month}-${day}`;
        const genderCode = parseInt(nationalId.substring(12, 13));
        const gender = genderCode % 2 === 1 ? 'MALE' : 'FEMALE';
        const governorateCode = nationalId.substring(7, 9);
        const placeOfBirth = this.governoratesCodes[governorateCode] || 'القاهرة';

        this.personalInfoGroup.get('dateOfBirth')?.setValue(dateOfBirth);
        this.personalInfoGroup.get('gender')?.setValue(gender);
        this.personalInfoGroup.get('placeOfBirth')?.setValue(placeOfBirth);
      } catch (error) {
        console.error('خطأ في استخراج البيانات من الرقم القومي:', error);
      }
    }
  }

  extractFatherDataFromNationalId(nationalId: string) {
    if (nationalId && nationalId.length === 14) {
      try {
        const genderCode = parseInt(nationalId.substring(12, 13));
        if (genderCode % 2 !== 1) {
          console.warn('الرقم القومي المدخل ليس لذكر');
          this.Toast.fire({
            icon: 'warning',
            title: 'الرقم القومي المدخل ليس لذكر',
          });
        }
      } catch (error) {
        console.error('خطأ في التحقق من الرقم القومي للأب:', error);
      }
    }
  }

  updateResidenceAddress() {
    let countryName = "مصر";
    if (this.selectedCountry() !== "EG") {
      const countryObj = this.countries.find(c => c.isoCode === this.selectedCountry());
      if (countryObj) {
        countryName = countryObj.name;
      }
    }
    const governorateId = this.contactInfoGroup.get('governorate')?.value;
    let governorateName = "";
    if (governorateId) {
      const governorate = this.governorates.find(gov => gov.id === governorateId);
      if (governorate) {
        governorateName = governorate.governorate_name_ar;
      }
    }
    const cityId = this.contactInfoGroup.get('city')?.value;
    let cityName = "";
    if (cityId) {
      const city = this.cities.find(city => city.id === cityId);
      if (city) {
        cityName = city.city_name_ar;
      }
    }
    const fullAddress = [countryName, governorateName, cityName].filter(Boolean).join(" - ");
    this.contactInfoGroup.get('residenceAddress')?.setValue(fullAddress);
  }

  loadUserData(): void {
    const userId: any = localStorage.getItem('Uid');
    if (userId) {
      console.log('تم العثور على معرف المستخدم:', userId);
      this.ArService.getArById(userId).subscribe({
        next: (res: any) => {
          if (res && res.data) {
            console.log('تم استرجاع بيانات المستخدم:', res.data);
            this.isEditMode = true;

            // تعديل التحقق من حقول كلمة المرور في وضع التعديل
            this.accountSetupGroup.get('password')?.clearValidators();
            this.accountSetupGroup.get('password')?.setValidators(
              Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            );
            this.accountSetupGroup.get('password')?.updateValueAndValidity();
            this.accountSetupGroup.get('rePassword')?.clearValidators();
            this.accountSetupGroup.get('rePassword')?.updateValueAndValidity();

            // تعبئة النماذج الفرعية بالبيانات
            this.personalInfoGroup.patchValue({
              firstName: res.data.firstName,
              studentCode: res.data.studentCode,
              lastName: res.data.lastName,
              nationalId: res.data.nationalId,
              dateOfBirth: res.data.dateOfBirth,
              gender: res.data.gender,
              religion: res.data.religion,
              placeOfBirth: res.data.placeOfBirth,
              
            });
            this.familyInfoGroup.patchValue({
              fatherName: res.data.fatherName,
              fatherNationalId: res.data.fatherNationalId,
              fatherOccupation: res.data.fatherOccupation,
              fatherPhoneNumber: res.data.fatherPhoneNumber,
              guardianName: res.data.guardianName,
              guardianNationalId: res.data.guardianNationalId,
              guardianRelationship: res.data.guardianRelationship,
              guardianPhoneNumber: res.data.guardianPhoneNumber,
              parentsStatus: res.data.parentsStatus,
              familyAbroad: res.data.familyAbroad,
              media: res.data.media
            });
           this.academicInfoGroup.patchValue({
  universityId: res.data.university.id
});

// 1. عبّي قائمة الكليات بناءً على الجامعة المختارة:
const universityIdStr = String(res.data.university.id);
this.faculties = (this.facultiesMap as any)[universityIdStr] || [];

// 2. اتأكد إن الكلية اللي جاية من الـ API موجودة فعلاً في الـ faculties الجديدة:
const selectedFaculty = this.faculties.find(f => f.trim() === res.data.faculty.trim()) || '';

// 3. اعمل patchValue للكلية بعد ما تظبط قائمة الكليات:
this.academicInfoGroup.patchValue({
  faculty: selectedFaculty
});

// كمل باقي القيم زي ما تحب...
this.academicInfoGroup.patchValue({
  level: res.data.level,
  previousAcademicYearGpa: res.data.previousAcademicYearGpa,
  totalGradesHighSchool: res.data.totalGradesHighSchool,
  secondaryDivision: res.data.secondaryDivision,
  housingInPreviousYears: res.data.housingInPreviousYears,
  annualGrade: res.data.annualGrade, 
  houseTypeName: res.data.houseTypeName,
  wantFood: res.data.wantFood
});

            this.contactInfoGroup.patchValue({
              mobileNumber: res.data.mobileNumber,
              phoneNumber: res.data.phoneNumber,
              residenceAddress: res.data.residenceAddress,
              detailedAddress: res.data.detailedAddress,
              country: res.data.country,
              governorate: res.data.governorate,
              city: res.data.city
            });
            this.accountSetupGroup.patchValue({
              username: res.data.username,
              confirmDataAccuracy: true
            });

            // تحليل عنوان الإقامة
            this.parseResidenceAddress(res.data.residenceAddress);

            // تحديد نوع الطالب
            if (res.data.previousAcademicYearGpa !== null && res.data.previousAcademicYearGpa !== undefined) {
              this.selectStudentType('old');
            } else if (res.data.totalGradesHighSchool !== null && res.data.totalGradesHighSchool !== undefined) {
              this.selectStudentType('new');
            }
          }
        },
        error: (error) => {
          console.error('خطأ في استرجاع بيانات المستخدم:', error);
        }
      });
    }
  }

  parseResidenceAddress(residenceAddress: string): void {
    if (!residenceAddress) return;
    console.log('تحليل عنوان الإقامة:', residenceAddress);
    const parts = residenceAddress.split(' - ');
    if (parts.length >= 1) {
      const countryName = parts[0];
      if (countryName === 'مصر') {
        this.selectedCountry.set('EG');
        this.contactInfoGroup.get('country')?.setValue('EG');
        console.log('تم تحديد الدولة: مصر (EG)');
      }
    }
    setTimeout(() => {
      if (parts.length >= 2 && this.selectedCountry() === 'EG') {
        const governorateName = parts[1];
        const governoratesData = this.governorates;
        const governorate = governoratesData.find(g =>
          g.governorate_name_ar === governorateName ||
          g.governorate_name_ar.replace('ة', 'ه') === governorateName.replace('ة', 'ه')
        );
        if (governorate) {
          this.selectedGovernorate.set(governorate.id);
          this.contactInfoGroup.get('governorate')?.setValue(governorate.id);
          console.log('تم تحديد المحافظة:', governorate.id, governorateName);
          setTimeout(() => {
            if (parts.length >= 3) {
              const cityName = parts[2];
              const citiesData = this.cities;
              const city = citiesData.find(c =>
                c.governorate_id === governorate.id &&
                (c.city_name_ar === cityName ||
                  c.city_name_ar.replace('ة', 'ه') === cityName.replace('ة', 'ه'))
              );
              if (city) {
                this.contactInfoGroup.get('city')?.setValue(city.id);
                console.log('تم تحديد المدينة:', city.id, cityName);
              } else {
                console.log('لم يتم العثور على المدينة:', cityName);
              }
            }
          }, 300);
        } else {
          console.log('لم يتم العثور على المحافظة:', governorateName);
        }
      }
    }, 300);
  }

  selectStudentType(type: 'old' | 'new') {
    this.studentType = type;
    this.activeButton = type;
    this.updateValidation(type);
    this.clearFormBasedOnType();
  }

  updateValidation(studentType: 'old' | 'new') {
    const previousAcademicYearGpaControl = this.academicInfoGroup.get('previousAcademicYearGpa');
    const highSchoolGradeControl = this.academicInfoGroup.get('totalGradesHighSchool');
    const secondaryDivisionControl = this.academicInfoGroup.get('secondaryDivision');
    const housingInPreviousYearsControl = this.academicInfoGroup.get('housingInPreviousYears');
    const annualGradeControl = this.academicInfoGroup.get('annualGrade');
    if (studentType === 'old') {
      previousAcademicYearGpaControl?.setValidators([Validators.required]);
      housingInPreviousYearsControl?.setValidators([Validators.required]);
      annualGradeControl?.setValidators([Validators.required]);
      highSchoolGradeControl?.clearValidators();
      secondaryDivisionControl?.clearValidators();
    } else if (studentType === 'new') {
      highSchoolGradeControl?.setValidators([Validators.required]);
      secondaryDivisionControl?.setValidators([Validators.required]);
      annualGradeControl?.clearValidators();
      previousAcademicYearGpaControl?.clearValidators();
      housingInPreviousYearsControl?.clearValidators();
    }
    previousAcademicYearGpaControl?.updateValueAndValidity();
    highSchoolGradeControl?.updateValueAndValidity();
    secondaryDivisionControl?.updateValueAndValidity();
    housingInPreviousYearsControl?.updateValueAndValidity();
    annualGradeControl?.updateValueAndValidity();
  }

  clearFormBasedOnType() {
    if (this.studentType === 'old') {
      this.academicInfoGroup.get('totalGradesHighSchool')?.reset();
      this.academicInfoGroup.get('secondaryDivision')?.reset();
    } else if (this.studentType === 'new') {
      this.academicInfoGroup.get('annualGrade')?.reset();
      this.academicInfoGroup.get('previousAcademicYearGpa')?.reset();
      this.academicInfoGroup.get('housingInPreviousYears')?.reset();
    }
  }

  handleSubmit() {
    if (this.AppRequest.valid) {
      if (this.isEditMode) {
        this.updateApplication();
        console.log(this.AppRequest.value);

      } else {
        this.registerSubmit();
       console.log(this.AppRequest.value);
      }
    } else {
      console.log('Form is invalid. Check each step.');
      this.Toast.fire({
        icon: 'error',
        title: 'يرجى ملء جميع الحقول المطلوبة',
      });
    }
  }

  registerSubmit() {
    if (this.AppRequest.valid) {
      // تحويل البيانات المتداخلة إلى هيكل مسطح للإرسال
      const formData = this.flattenFormData(this.AppRequest.value);
      console.log('Form Data to submit:', formData);
      this._AuthService.setRegisterForm(formData).subscribe({
        next: (res: any) => {
          if (res.body.success === false) {
            this.errmsg = res.body.message;
            console.log(res);
            this.Toast.fire({
              icon: 'error',
              title: this.errmsg,
            });
          } else {
            this.Toast.fire({
              icon: 'success',
              title: 'تم الارسال بنجاح يمكنك تسجيل الدخول',
            });
            console.log('register res:', res);
            setTimeout(() => {
              this.router.navigate(['/guest/login']);
            }, 3000);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.Toast.fire({
            icon: 'error',
            title: err.message,
          });
        }
      });
    }
  }

  updateApplication() {
    const userId: any = localStorage.getItem('Uid');
    if (userId && this.AppRequest.valid) {
      const formData = this.flattenFormData(this.AppRequest.value);
      delete formData.rePassword;
      if (!formData.password || formData.password === '' || formData.password === null) {
        delete formData.password;
      }
      console.log('البيانات المرسلة للتحديث:', formData);
      this.ArService.updateAr(userId, formData).subscribe({
        next: (res: any) => {
          console.log('تم تحديث البيانات بنجاح:', res);
          this.Toast.fire({
            icon: 'success',
            title: 'تم تحديث البيانات بنجاح',
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('خطأ في تحديث البيانات:', err);
          this.Toast.fire({
            icon: 'error',
            title: err.message || 'حدث خطأ أثناء تحديث البيانات',
          });
        }
      });
    }
  }

  // دالة لتحويل البيانات المتداخلة إلى هيكل مسطح
  flattenFormData(formData: any): any {
    const result: any = {};
    Object.keys(formData).forEach(key => {
      const nestedData = formData[key];
      Object.keys(nestedData).forEach(nestedKey => {
        result[nestedKey] = nestedData[nestedKey];
      });
    });
    return result;
  }
}