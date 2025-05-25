import { Component, inject } from '@angular/core';
import { LoginComponent } from "../../../components/index/login/login.component";
import { AuthLayoutComponent } from "../../admin/display/auth-layout/auth-layout.component";
import { AuthService } from '../../../core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [ AuthLayoutComponent , ReactiveFormsModule, NgClass],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.scss'
})
export class ForgotpasswordComponent {

   private readonly _AuthService= inject(AuthService)
    private readonly router= inject(Router)
   
  
    forgotPasswordForm : FormGroup = new FormGroup({
  
    email: new FormControl(null ,[Validators.required ,Validators.email] ),
    
  })
  


  onSubmit() {
    this._AuthService.setForgotPassword(this.forgotPasswordForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.forgotPasswordForm.reset();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
