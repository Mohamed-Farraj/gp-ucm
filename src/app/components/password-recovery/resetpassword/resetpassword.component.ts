import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLayoutComponent } from "../../admin/display/auth-layout/auth-layout.component";
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [ReactiveFormsModule, AuthLayoutComponent, NgClass] ,
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss'
})
export class ResetpasswordComponent {

    private readonly _AuthService= inject(AuthService)
    showPassword: boolean = false;
        private readonly router= inject(Router)
    
    resetPasswordForm : FormGroup = new FormGroup({
    
      newPassword: new FormControl(null , [Validators.required , Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
      token: new FormControl(null)
    })
    


     

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.resetPasswordForm.get('token')?.setValue(params.get('token'));
      console.log('Token:', this.resetPasswordForm.get('token')?.value);
      // ممكن تستخدم الـ token هنا في طلب API أو أي منطق آخر
    });
  }


    
    onSubmit(){
      this._AuthService.setResetPassword(this.resetPasswordForm.value).subscribe({
        next:(res)=>{
          console.log(res)
          this.router.navigate(['/guest/login'])
        },
        error:(err)=>{
          console.log(err)
        }
      })
    }


togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

}
