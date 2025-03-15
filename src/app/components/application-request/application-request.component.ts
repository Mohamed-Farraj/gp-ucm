import { Component, signal , WritableSignal , computed, Signal, inject   } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { single } from 'rxjs';
import countries from '../../../assets/country (1).json';
import rawGovernorates from '../../../assets/cities (1).json';  // لاحظ أن البيانات تأتي من ملف cities.json
import rawCities from '../../../assets/states (1).json';  // لاحظ أن البيانات تأتي من ملف states.json
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-application-request',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './application-request.component.html',
  styleUrl: './application-request.component.scss'
})
export class ApplicationRequestComponent {

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
  errmsg:string='';
   

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
    city: new FormControl(null)
 
  } , this.passwordConfirmation)



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
  }

  updateResidenceAddress() {
    const country = this.selectedCountry() === "EG" ? "مصر" : this.selectedCountry();
    const governorate = this.AppRequest.get('governorate')?.value 
      ? this.governorates.find(gov => gov.id === this.AppRequest.get('governorate')?.value)?.governorate_name_ar
      : "";
    const city = this.AppRequest.get('city')?.value 
      ? this.cities.find(city => city.id === this.AppRequest.get('city')?.value)?.city_name_ar
      : "";

    const fullAddress = [country, governorate, city].filter(Boolean).join(" - ");
    this.AppRequest.get('residenceAddress')?.setValue(fullAddress);
    console.log("العنوان المحفوظ:", fullAddress);
  }
  countries = countries;

  selectedCountry: WritableSignal<string | null> = signal(null);
  selectedGovernorate: WritableSignal<string | null> = signal(null);

  // ✅ تحميل المحافظات المرتبطة بمصر فقط
  governorates = rawGovernorates.find(entry => entry.type === 'table' && entry.name === 'governorates')?.data || [];
  filteredGovernorates: Signal<any[]> = computed(() => {
    return this.selectedCountry() === "EG" ? this.governorates.filter(gov => gov.countryCode === "EG") : [];
  });

  // ✅ تحميل جميع المدن وربطها بالمحافظة المختارة
  cities = rawCities.find(entry => entry.type === 'table' && entry.name === 'cities')?.data || [];
  filteredCities: Signal<any[]> = computed(() => {
    const govId = this.selectedGovernorate();
    return govId ? this.cities.filter(city => city.governorate_id === govId) : [];
  });





  passwordConfirmation(g:AbstractControl)
{
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
            title: 'تم الارسال بنجاح',
          })   
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

  this.clearFormBasedOnType();
}

// دالة لمسح الحقول بناءً على نوع الطالب
clearFormBasedOnType() {
  if (this.studentType === 'old') {
    this.AppRequest.get('totalGradesHighSchool')?.reset();
    this.AppRequest.get('secondaryDivision')?.reset();
  } else if (this.studentType === 'new') {
    this.AppRequest.get('previousAcademicYearGpa')?.reset();
    this.AppRequest.get('housingInPreviousYearsControl')?.reset();

  }
}


}
