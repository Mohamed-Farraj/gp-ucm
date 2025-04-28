import { ArService } from './../../core/services/ar.service';
import { Component, signal , WritableSignal , computed, Signal, inject, OnInit, HostListener   } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { single } from 'rxjs';
import countries from '../../../assets/country (1).json';
import rawGovernorates from '../../../assets/cities (1).json';  // لاحظ أن البيانات تأتي من ملف cities.json
import rawCities from '../../../assets/states (1).json';  // لاحظ أن البيانات تأتي من ملف states.json
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BasicInfoStepComponent } from "../newest-app-reqeust/basic-info-step/basic-info-step.component";
import { FamilyInfoStepComponent } from "../newest-app-reqeust/family-info-step/family-info-step.component";
import { AcademicInfoStepComponent } from "../newest-app-reqeust/academic-info-step/academic-info-step.component";
import { ContactInfoStepComponent } from "../newest-app-reqeust/contact-info-step/contact-info-step.component";
import { AccountSetupStepComponent } from "../newest-app-reqeust/account-setup-step/account-setup-step.component";
import { MatStepperModule } from '@angular/material/stepper';
import { StepperComponent } from '../stepper/stepper.component';
import { CdkStepper } from '@angular/cdk/stepper';
import { NgIf } from '@angular/common';
import { get } from 'node:http';


@Component({
  selector: 'app-application-request',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule , MatStepperModule , BasicInfoStepComponent, FamilyInfoStepComponent, AcademicInfoStepComponent, ContactInfoStepComponent, AccountSetupStepComponent , ],
  templateUrl: './application-request.component.html',
  styleUrl: './application-request.component.scss',
    providers:[{provide:CdkStepper,useExisting:StepperComponent}]
  
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
  })

  private readonly _AuthService= inject(AuthService)
  private readonly router = inject(Router)
  private readonly ArService=inject(ArService)
  errmsg:string='';
  isEditMode = false;
  showPasswordFields = true; // تم تغيير القيمة الافتراضية إلى true لإظهار حقول كلمة المرور دائمًا

  // قائمة محافظات مصر مع أكوادها في الرقم القومي
  governoratesCodes: { [key: string]: string } = {
    '01': 'القاهره',
    '02': 'الاسكندريه',
    '03': 'بورسعيد',
    '04': 'السويس',
    '11': 'دمياط',
    '12': 'الدقهلية',
    '13': 'الشرقيه',
    '14': 'القليوبيه',
    '15': 'كفرالشيخ',
    '16': 'الغربيه',
    '17': 'المنوفيه',
    '18': 'البحيرة',
    '19': 'الاسماعيلية',
    '21': 'الجيزه',
    '22': 'بني سويف',
    '23': 'الفيوم',
    '24': 'المنيا',
    '25': 'اسيوط',
    '26': 'سوهاج',
    '27': 'قنــا',
    '28': 'اسوان',
    '29': 'الاقصـر',
    '31': 'البحر الاحمر',
    '32': 'الوادي الجديد',
    '33': 'مرسي مطروح',
    '34': 'شمال سيناء',
    '35': 'جنوب سيناء',
    '88': 'خارج مصر'
  };

    AppRequest : FormGroup = new FormGroup({
    firstName: new FormControl(null ,[Validators.required]),
    lastName: new FormControl(null , [Validators.required]),
    username: new FormControl(null , [Validators.required , Validators.email]),//emails
    password: new FormControl(null , [Validators.required , Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
    rePassword: new FormControl(null , [Validators.required ]),

    role: new FormControl("USER"),
    universityId: new FormControl("1"),
    nationalId: new FormControl(null , [Validators.required ,Validators.pattern(/^\d{14}$/)]),
    mobileNumber: new FormControl(null , [Validators.required , Validators.pattern(/^01[0-25]\d{8}$/)]),
    faculty: new FormControl(null , [Validators.required ]),
    level: new FormControl(null , [Validators.required]),
    dateOfBirth: new FormControl(null , [Validators.required]),
    residenceAddress: new FormControl(null, [Validators.required]),
    detailedAddress: new FormControl(null, [Validators.required]),
    placeOfBirth: new FormControl(null, [Validators.required]),
    gender: new FormControl(null, [Validators.required]),
    religion: new FormControl(null, [Validators.required]),
    fatherName: new FormControl(null, [Validators.required]),
    fatherNationalId: new FormControl(null, [Validators.required ,Validators.pattern(/^\d{14}$/)]),
    fatherOccupation: new FormControl(null, [Validators.required]),
    fatherPhoneNumber: new FormControl(null, [Validators.required]),
    guardianName: new FormControl(null, [Validators.required]),
    guardianNationalId: new FormControl(null, [Validators.required , Validators.pattern(/^\d{14}$/)]),
    guardianPhoneNumber: new FormControl(null, [Validators.required]),
    parentsStatus: new FormControl(null, [Validators.required]),
    previousAcademicYearGpa: new FormControl(null),
    status: new FormControl(2),
    housingInPreviousYears: new FormControl(null),
    familyAbroad: new FormControl(null),
    specialNeeds: new FormControl(null),
    secondaryDivision: new FormControl(null),
    totalGradesHighSchool: new FormControl(null),
    country: new FormControl(null), //  
    governorate: new FormControl(null ),
    city: new FormControl(null),  
    securityCheck: new FormControl("PENDING"),

    confirmDataAccuracy: new FormControl(true, [Validators.requiredTrue]), 
 
  } , this.passwordConfirmation)

  ngOnInit(): void {
    // استرجاع بيانات الطالب إذا كان مسجلاً
    this.loadUserData();
  }

  isMobile = window.innerWidth < 768; // مثلاً

@HostListener('window:resize', ['$event'])
onResize(event:any) {
  this.isMobile = window.innerWidth < 768;
}
  debugForm() {
    console.log(this.AppRequest);
  }

  // دالة لتحميل بيانات المستخدم
  loadUserData(): void {
    const userId:any = localStorage.getItem('Uid');
    
    if (userId) {
      console.log('تم العثور على معرف المستخدم:', userId);
      this.ArService.getArById(userId).subscribe({
        next: (res: any) => {
          if (res && res.data) {
            console.log('تم استرجاع بيانات المستخدم:', res.data);
            
            // تعيين وضع التعديل
            this.isEditMode = true;
            
            // تعديل التحقق من حقول كلمة المرور في وضع التعديل
            // جعل حقول كلمة المرور اختيارية في وضع التعديل
            this.AppRequest.get('password')?.clearValidators();
            this.AppRequest.get('password')?.setValidators(
              Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            );
            this.AppRequest.get('password')?.updateValueAndValidity();
            
            this.AppRequest.get('rePassword')?.clearValidators();
            this.AppRequest.get('rePassword')?.updateValueAndValidity();
            
            // تعبئة النموذج بالبيانات المسترجعة
            this.AppRequest.patchValue(res.data);
            
            // تحليل عنوان الإقامة إلى مكوناته (الدولة، المحافظة، المدينة)
            this.parseResidenceAddress(res.data.residenceAddress);
            
            // معالجة الاختيارات المتسلسلة
            this.handleCascadingSelections(res.data);
            
            // تحديد نوع الطالب بناءً على البيانات المسترجعة
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

  // دالة جديدة لتحليل عنوان الإقامة
  parseResidenceAddress(residenceAddress: string): void {
    if (!residenceAddress) return;
    
    console.log('تحليل عنوان الإقامة:', residenceAddress);
    
    // تقسيم العنوان بناءً على الفاصل " - "
    const parts = residenceAddress.split(' - ');
    
    if (parts.length >= 1) {
      // تحديد الدولة
      const countryName = parts[0];
      // البحث عن رمز الدولة المناسب
      if (countryName === 'مصر') {
        // حالة خاصة لمصر - بناءً على ملف JSON الفعلي
        this.selectedCountry.set('EG');
        this.AppRequest.get('country')?.setValue('EG');
        console.log('تم تحديد الدولة: مصر (EG)');
      }
    }
    
    // تأخير قصير لضمان تحديث قائمة المحافظات
    setTimeout(() => {
      if (parts.length >= 2 && this.selectedCountry() === 'EG') {
        // تحديد المحافظة
        const governorateName = parts[1];
        
        // الحصول على بيانات المحافظات من ملف JSON
        const governoratesData = this.governorates;
        
        // البحث عن المحافظة باستخدام الاسم العربي
        const governorate = governoratesData.find(g => 
          g.governorate_name_ar === governorateName || 
          // التعامل مع الاختلافات البسيطة في الأسماء
          g.governorate_name_ar.replace('ة', 'ه') === governorateName.replace('ة', 'ه')
        );
        
        if (governorate) {
          this.selectedGovernorate.set(governorate.id);
          this.AppRequest.get('governorate')?.setValue(governorate.id);
          console.log('تم تحديد المحافظة:', governorate.id, governorateName);
          
          // تأخير آخر لضمان تحديث قائمة المدن
          setTimeout(() => {
            if (parts.length >= 3) {
              // تحديد المدينة
              const cityName = parts[2];
              
              // الحصول على بيانات المدن من ملف JSON
              const citiesData = this.cities;
              
              // البحث عن المدينة باستخدام الاسم العربي والمحافظة
              const city = citiesData.find(c => 
                c.governorate_id === governorate.id && 
                (c.city_name_ar === cityName || 
                // التعامل مع الاختلافات البسيطة في الأسماء
                c.city_name_ar.replace('ة', 'ه') === cityName.replace('ة', 'ه'))
              );
              
              if (city) {
                this.AppRequest.get('city')?.setValue(city.id);
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

  // دالة جديدة لمعالجة الاختيارات المتسلسلة
  handleCascadingSelections(data: any): void {
    // معالجة الكلية والفرقة
    if (data.faculty) {
      this.facultySelected.set(data.faculty);
      
      // تأخير قصير لضمان تحديث قائمة الفرق
      setTimeout(() => {
        if (data.level) {
          this.AppRequest.get('level')?.setValue(data.level);
        }
      }, 100);
    }
    
    // معالجة حالة الوالدين
    if (data.parentsStatus) {
      this.AppRequest.get('parentsStatus')?.setValue(data.parentsStatus);
    }
    
    // معالجة السكن في الأعوام السابقة
    if (data.housingInPreviousYears) {
      this.AppRequest.get('housingInPreviousYears')?.setValue(data.housingInPreviousYears);
    }
  }

  // دالة لتحديث طلب الالتحاق
  updateApplication() {
    const userId:any = localStorage.getItem('Uid');
    if (userId && this.AppRequest.valid) {
      // نسخ البيانات من النموذج
      const formData = {...this.AppRequest.value};
      
      // حذف حقل rePassword دائماً عند التحديث
      delete formData.rePassword;
      
      // التحقق من حقل كلمة المرور - إذا كان فارغاً، نحذفه من البيانات المرسلة
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

  // دالة للتعامل مع إرسال النموذج (تسجيل أو تعديل)
  handleSubmit() {
    if (this.AppRequest.valid) {
      if (this.isEditMode) {
        this.updateApplication();
      } else {
        this.registerSubmit();
      }
    }
  }

  // الكليات التي لديها 5 فرق دراسية
  fiveYearFaculties: string[] = ['كلية الهندسة بالمطرية', 'كلية الهندسة بحلوان', 'كلية الطب'];

  // استخدام Signal لتحديث الفرق عند تغيير الكلية
  facultySelected: WritableSignal<string | null> = signal(null);
  levels: Signal<{ value: string; label: string }[]> = computed(() => {
    const faculty = this.facultySelected();
    if (faculty && this.fiveYearFaculties.includes(faculty)) {
      return [
        { value: 'first', label: 'الأولى' },
        { value: 'second', label: 'الثانية' },
        { value: 'third', label: 'الثالثة' },
        { value: 'fourth', label: 'الرابعة' },
        { value: 'fifth', label: 'الخامسة' }
      ];
    }
    return [
      { value: 'first', label: 'الأولى' },
      { value: 'second', label: 'الثانية' },
      { value: 'third', label: 'الثالثة' },
      { value: 'fourth', label: 'الرابعة' }
    ];
  });

  constructor() {
    // استمع لتغييرات الكلية
    this.AppRequest.get('faculty')?.valueChanges.subscribe(faculty => {
      this.facultySelected.set(faculty);
      this.AppRequest.get('level')?.setValue(null); // إعادة تعيين قيمة الفرق
    });

    this.AppRequest.get('country')?.valueChanges.subscribe(country => {
      console.log("تم اختيار الدولة:", country);
      this.selectedCountry.set(country);
      this.AppRequest.get('governorate')?.setValue(null);
      this.AppRequest.get('city')?.setValue(null);
      this.AppRequest.get('residenceAddress')?.setValue(null); // ✅ إعادة تعيين العنوان
    });

    this.AppRequest.get('governorate')?.valueChanges.subscribe(governorate => {
      console.log("تم اختيار المحافظة:", governorate);
      this.selectedGovernorate.set(governorate);
      this.AppRequest.get('city')?.setValue(null);
      this.updateResidenceAddress();
    });

    this.AppRequest.get('city')?.valueChanges.subscribe(() => {
      this.updateResidenceAddress();
    });

    // استمع لتغييرات الرقم القومي
    this.AppRequest.get('nationalId')?.valueChanges.subscribe(nationalId => {
      if (nationalId && nationalId.length === 14) {
        this.extractDataFromNationalId(nationalId);
      }
    });

    // استمع لتغييرات الرقم القومي للأب
    this.AppRequest.get('fatherNationalId')?.valueChanges.subscribe(fatherNationalId => {
      if (fatherNationalId && fatherNationalId.length === 14) {
        this.extractFatherDataFromNationalId(fatherNationalId);
      }
    });
    
    // استمع لتغييرات كلمة المرور وتأكيد كلمة المرور للتحقق من التطابق
    this.AppRequest.get('password')?.valueChanges.subscribe(() => {
      this.AppRequest.get('rePassword')?.updateValueAndValidity();
    });
  }

  // استخراج البيانات من الرقم القومي
  extractDataFromNationalId(nationalId: string) {
    if (nationalId && nationalId.length === 14) {
      try {
        // استخراج تاريخ الميلاد
        const century = nationalId.charAt(0) === '2' ? '19' : '20';
        const year = century + nationalId.substring(1, 3);
        const month = nationalId.substring(3, 5);
        const day = nationalId.substring(5, 7);
        const dateOfBirth = `${year}-${month}-${day}`;
        
        // استخراج النوع (الجنس)
        const genderCode = parseInt(nationalId.substring(12, 13));
        const gender = genderCode % 2 === 1 ? 'MALE' : 'FEMALE';
        
        // استخراج محافظة الميلاد
        const governorateCode = nationalId.substring(7, 9);
        const placeOfBirth = this.governoratesCodes[governorateCode] || 'القاهره';
        
        // تعيين القيم في النموذج
        this.AppRequest.get('dateOfBirth')?.setValue(dateOfBirth);
        this.AppRequest.get('gender')?.setValue(gender);
        this.AppRequest.get('placeOfBirth')?.setValue(placeOfBirth);
        
        console.log('تم استخراج البيانات من الرقم القومي:', { dateOfBirth, gender, placeOfBirth });
      } catch (error) {
        console.error('خطأ في استخراج البيانات من الرقم القومي:', error);
      }
    }
  }

  
  // استخراج بيانات الأب من الرقم القومي
  extractFatherDataFromNationalId(nationalId: string) {
    if (nationalId && nationalId.length === 14) {
      try {
        // استخراج النوع للتأكد من أنه ذكر
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
    // استخدام الاسم العربي للدولة من ملف JSON
    let countryName = "مصر"; // القيمة الافتراضية لمصر
    if (this.selectedCountry() !== "EG") {
      const countryObj = this.countries.find(c => c.isoCode === this.selectedCountry());
      if (countryObj) {
        countryName = countryObj.name;
      }
    }
    
    // استخدام الاسم العربي للمحافظة من ملف JSON
    const governorateId = this.AppRequest.get('governorate')?.value;
    let governorateName = "";
    if (governorateId) {
      const governorate = this.governorates.find(gov => gov.id === governorateId);
      if (governorate) {
        governorateName = governorate.governorate_name_ar;
      }
    }
    
    // استخدام الاسم العربي للمدينة من ملف JSON
    const cityId = this.AppRequest.get('city')?.value;
    let cityName = "";
    if (cityId) {
      const city = this.cities.find(city => city.id === cityId);
      if (city) {
        cityName = city.city_name_ar;
      }
    }

    const fullAddress = [countryName, governorateName, cityName].filter(Boolean).join(" - ");
    this.AppRequest.get('residenceAddress')?.setValue(fullAddress);
    console.log("العنوان المحفوظ:", fullAddress);
  }
  
  // تحميل بيانات الدول من ملف JSON
  countries = countries;

  selectedCountry: WritableSignal<string | null> = signal(null);
  selectedGovernorate: WritableSignal<string | null> = signal(null);

  // تحميل المحافظات من ملف JSON
  governorates = rawGovernorates.find(entry => entry.type === 'table' && entry.name === 'governorates')?.data || [];
  filteredGovernorates: Signal<any[]> = computed(() => {
    return this.selectedCountry() === "EG" ? this.governorates.filter(gov => gov.countryCode === "EG") : [];
  });

  // تحميل المدن من ملف JSON
  cities = rawCities.find(entry => entry.type === 'table' && entry.name === 'cities')?.data || [];
  filteredCities: Signal<any[]> = computed(() => {
    const govId = this.selectedGovernorate();
    return govId ? this.cities.filter(city => city.governorate_id === govId) : [];
  });

  passwordConfirmation(g:AbstractControl)
  {
    // إذا كنا في وضع التعديل وكلمة المرور فارغة، نتجاهل التحقق من التطابق
    if ( (!g.get("password")?.value || g.get("password")?.value === '')) {
      return null;
    }
    
    if(g.get("password")?.value === g.get("rePassword")?.value){
      return null
    }
    else
      return {mismatch:true}
  }

  registerSubmit(){
    if(this.AppRequest.valid){
      console.log(this.AppRequest.value)
      this._AuthService.setRegisterForm(this.AppRequest.value).subscribe({
        next:(res:any)=>{
          if(res.body.success === false) {
            this.errmsg=res.body.message
            console.log(res)
            this.Toast.fire({
              icon: 'error',
              title: this.errmsg,
            })   
          }
          else{
            this.Toast.fire({
              icon: 'success',
              title: 'تم الارسال بنجاح يمكنك تسجيل الدخول',
            })

            console.log('register res:',res);
            
            setTimeout(() => {
              this.router.navigate(['/guest/login']);
            }, 3000);
            
          }
        
        },

        error:(err:HttpErrorResponse)=>{
          
          console.log(err)
          this.Toast.fire({
            icon: 'error',
            title: err.message,
          })   
        }

      })
        console.log(this.AppRequest)
    }
  }

  updateValidation(studentType: 'old' | 'new') {
    const previousAcademicYearGpaControl = this.AppRequest.get('previousAcademicYearGpa');
    const highSchoolGradeControl = this.AppRequest.get('totalGradesHighSchool');
    const secondaryDivisionControl = this.AppRequest.get('secondaryDivision');
    const housingInPreviousYearsControl = this.AppRequest.get('housingInPreviousYears')
    
    if (studentType === 'old') {
      // إضافة التحقق من الصحة لحقول القدامى
      previousAcademicYearGpaControl?.setValidators([Validators.required]);
      housingInPreviousYearsControl?.setValidators([Validators.required]);
      // إزالة التحقق من الصحة لحقول الجدد
      highSchoolGradeControl?.clearValidators();
      secondaryDivisionControl?.clearValidators();
    } else if (studentType === 'new') {
      // إضافة التحقق من الصحة لحقول الجدد
      highSchoolGradeControl?.setValidators([Validators.required]);
      secondaryDivisionControl?.setValidators([Validators.required]);

      // إزالة التحقق من الصحة لحقول القدامى
      previousAcademicYearGpaControl?.clearValidators();
      housingInPreviousYearsControl?.clearValidators();
    }

    // تحديث حالة التحقق من الصحة
    previousAcademicYearGpaControl?.updateValueAndValidity();
    highSchoolGradeControl?.updateValueAndValidity();
    secondaryDivisionControl?.updateValueAndValidity();
    housingInPreviousYearsControl?.updateValueAndValidity();
  }


  studentType: 'old' | 'new' | null = null; // لتحديد نوع الطالب
  activeButton: 'old' | 'new' | null = null; // لتحديد الزر النشط

  selectStudentType(type: 'old' | 'new') {
    this.studentType = type;
    this.activeButton = type; // تحديث الزر النشط

    this.updateValidation(type);
    this.clearFormBasedOnType();
  }

  // دالة لمسح الحقول بناءً على نوع الطالب
  clearFormBasedOnType() {
    if (this.studentType === 'old') {
      this.AppRequest.get('totalGradesHighSchool')?.reset();
      this.AppRequest.get('secondaryDivision')?.reset();
    } else if (this.studentType === 'new') {
      this.AppRequest.get('previousAcademicYearGpa')?.reset();
      this.AppRequest.get('housingInPreviousYears')?.reset();
    }
  }



}


