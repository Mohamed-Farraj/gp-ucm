import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { create } from 'domain';
import { AdminService } from '../../core/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registeradmin',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule],
templateUrl: './registeradmin.component.html',
  styleUrl: './registeradmin.component.scss'
})
export class registeradminComponent implements OnInit {
  private readonly _adminService = inject(AdminService);
  adminForm!: FormGroup;
  roleOptions = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'EDIT_ADMIN' },
    { id: 3, name: 'VIEW_ADMIN' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      console.log('Form submitted:', this.adminForm.value);
      this._adminService.createAdminAcc(this.adminForm.value).subscribe({
       next: (res: any) => {
         console.log(res);
       },
       error: (err) => {
         console.log(err);
       },
      })
      // Here you would typically call your service to create the admin account
      this.adminForm.reset();
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.adminForm.controls).forEach(key => {
        const control = this.adminForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}