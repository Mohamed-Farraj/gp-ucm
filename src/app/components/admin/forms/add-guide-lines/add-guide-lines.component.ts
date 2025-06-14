import { GuidelinsService } from '../../../../core/services/guidelins.service';
import { Component, ElementRef, inject, OnInit, viewChild, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { HomeService } from '../../../../services/guest/home.service';
import { NgIf } from '@angular/common';
import { ImplicitReceiver } from '@angular/compiler';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';
import { PrivilegesDirective } from '../../../../core/directives/privileges.directive';

@Component({
  selector: 'app-add-guide-lines',
  standalone: true,
  imports: [ReactiveFormsModule , NgIf , PrivilegesDirective ],
  templateUrl: './add-guide-lines.component.html',
  styleUrl: './add-guide-lines.component.scss'
})
export class AddGuideLinesComponent implements OnInit {
  private readonly _formBuilder= inject(FormBuilder)
  public readonly _AuthService = inject(AuthService)

  private readonly _GuidelinsService=inject(GuidelinsService)
  private readonly _HomeService=inject(HomeService)
  fileName:any
  file:any
  errmsg:string='';
  err:any=null
  result:any=[]
  text: string = '';
  id:any=null;
  uid:number=1;
  guidelineExists: boolean = false;

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

  guidelineForm: FormGroup = this._formBuilder.group({
  guidelines: [
    '', // initial value هنا
    [
      Validators.required,
      Validators.pattern(/^(?!.*(select|insert|update|delete|drop|;|--|<|>)).*$/i),
      (control: AbstractControl) =>
        (control.value || '').trim().length === 0 ? { whitespace: true } : null
    ]
    // هنا مفيش async validators
  ],
  media: [null]
});


  // ngOnInit(): void {
  //   //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //   //Add 'implements OnInit' to the class.
  //   this._HomeService.getGuidlines().subscribe({  
  //     next:(res:any)=>{
  //      console.log(res.data)
  //      this.result=res.data
  //      console.log(this.result[0])
  //      this.addguideForm.patchValue({
  //       guidelines: this.result[0]?.guidelines || ''
  //     });
  //     },
  //     error:(err)=>{
  //      console.log(err)
  //       this.err=err
  //     }

  //   })
  // }



selectedFile: File | null = null;

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}

 showFileInput = true;

resetFileInput() {
  this.showFileInput = false;
  setTimeout(() => {
    this.showFileInput = true;
  }, 0);
}


  ngOnInit(): void {
    this.fetchGuideline(1);
  }

  fetchGuideline(uid: number): void {
  this.uid = uid;
  this.resetFileInput()
  this.selectedFile = null;

  this._GuidelinsService.getGuidelines(this.uid).subscribe({
    next: (response: any) => {
      console.log('response.data.length:', response.data.length);
            console.log('response.data.', response.data);

      if (response.data.length > 0) {
        this.file = response.data[0].media;
        const fileUrl = this.file;
        const fileNameWithId = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

        // استخرج اسم الملف الأصلي (بدون ID أو أرقام في الآخر)
        this.fileName = this.getOriginalFileName(fileNameWithId);

        this.id = response.data[0].guideLinesId;
        console.log('Guideline ID:', this.id);
        this.guidelineExists = true;
        this.guidelineForm.patchValue({ guidelines: response.data[0].guidelines });
      } else {
        this.file = null;
        this.fileName = '';
        this.id = null;
        this.guidelineExists = false;
        this.guidelineForm.reset();

      }
    },
    error: (error) => {
      console.error('Error fetching guideline:', error);
      this.guidelineExists = false;
      this.id = null;
      this.guidelineForm.reset();
    },
  });
}

// ضيف الدالة دي في نفس الكمبوننت:
getOriginalFileName(fullName: string): string {
  if (!fullName) return '';
  // تقدر تضيف أو تعدل الامتدادات حسب الحاجة
  const match = fullName.match(/^(.+?\.(pdf|docx?|xlsx?|png|jpg|jpeg|gif))/i);
  return match ? match[1] : fullName;
}


  

  // Save or update the guideline
 saveGuideline(): void {
  // جهز form data
  const formData = new FormData();
  // دايمًا string حتى لو فاضي أو null
  const guidelinesValue = (this.guidelineForm.get('guidelines')?.value || '').trim();
  formData.append('guidelines', guidelinesValue);

  if (this.selectedFile) {
    formData.append('media', this.selectedFile);
  }

  if (this.guidelineExists) {
    // Update the existing guideline
    this._GuidelinsService.updateGuideline(this.uid, this.id, formData).subscribe({
      next: (response) => {
        this.Toast.fire({
          icon: 'success',
          title: 'تـم  تعديل الارشادات',
        });
        console.log('Guideline updated:', response);
        this.guidelineForm.markAsPristine();
        this.fetchGuideline(this.uid)
      },
      error: (error) => {
        console.error('Error updating guideline:', error);
      },
    });
  } else {
    // Create a new guideline
    this._GuidelinsService.setguideForm(this.uid, formData).subscribe({
      next: (response: any) => {
        this.id = response.data.guideLinesId;
        this.Toast.fire({
          icon: 'success',
          title: 'تـم اضـافه الارشادات',
        });
        console.log('Guideline created:', response);
        this.guidelineExists = true;
        this.guidelineForm.markAsPristine();
        this.fetchGuideline(this.uid)
      },
      error: (error) => {
        console.error('Error creating guideline:', error);
      },
    });
  }
}



  // Delete the guidelineهل أنت متأكد؟

deleteGuideline(): void {
  Swal.fire({
    title: 'هل أنت متأكد؟',
    text: 'لن تتمكن من التراجع عن هذا',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#e12e2e',
    cancelButtonColor: '#111b31',
    confirmButtonText: 'نعم، احذفه',
    cancelButtonText:'تراجع'
  }).then((result) => {
    if (result.isConfirmed) {
      this._GuidelinsService.deleteGuideline(this.uid, this.id).subscribe({
        next: (response) => {
          this.fileName = '';
          
          this.resetFileInput()
          Swal.fire({
            title: 'حـذف!',
            text: 'تم حذف إرشاداتك.',
            icon: 'success',
          });
          this.guidelineExists = false;
          this.fetchGuideline(this.uid);
          this.guidelineForm.reset();
        this.selectedFile = null;

        },
        error: (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'فشل في حذف الإرشادات',
            icon: 'error',
          });
          console.error('Error deleting guideline:', error);
        },
      });
    }
  });
}


  // setguideline(){
     
  //       console.log(this.addguideForm.value)
  //       this._GuidelinsService.setguideForm(this.addguideForm.value).subscribe({
  //         next:(res:any)=>{
              
  //           console.log(res)
  //         },
    
  //         error:(err:HttpErrorResponse)=>{
            
  //           console.log(err)
    
  //         }
    
  //       })
  //         console.log(this.addguideForm)
      
  }
