import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule , NgClass,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
 private readonly _AuthService= inject(AuthService)
 private readonly router= inject(Router)
 
  errmsg:string='';
  showPassword: boolean = false;

  loginForm : FormGroup = new FormGroup({

  username: new FormControl(null ,[Validators.required ,Validators.email] ),
  password: new FormControl(null , [Validators.required , Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
})


loginSubmit(){
 if(this.loginForm.valid){
    console.log(this.loginForm.value)
    this._AuthService.setLoginForm(this.loginForm.value).subscribe({
      next:(res:any)=>{
        if(res.body.success === false) {
           this.errmsg=res.body.message
        console.log(res)
        }
        else{
          setTimeout(() => {
            console.log('loginresponse',res);
            //save Token
            localStorage.setItem('userToken' , res?.body?.data?.token)
            localStorage.setItem('role' , res?.body?.data?.role)
            localStorage.setItem('Uid' , res?.body?.data?.userID)

            //decode Token
            this._AuthService.saveUserData(res.body.data)
            //navigate to home
            if(res?.body?.data?.role ==='USER')
            {
              this.router.navigate(['/hu/user-dashboard'])
            }
            if(res?.body?.data?.role ==='ADMIN' || res?.body?.data?.role ==='SUPERADMIN' || res?.body?.data?.role ==='Edit_ADMIN')
            {
              this.router.navigate(['/admin/'])
            }
          }, 1000);
        }
       
      },

      error:(err:HttpErrorResponse)=>{
        
        console.log(err)

      }

    })
      console.log(this.loginForm)
  }
  else{
    this.loginForm.markAllAsTouched()
  }
 
}

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}




}
