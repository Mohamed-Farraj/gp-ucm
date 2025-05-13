import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UniversityService } from '../../core/services/university.service';

@Component({
  selector: 'app-adduniversity',
  standalone: true,
  imports: [ReactiveFormsModule , NgClass ],
  templateUrl: './adduniversity.component.html',
  styleUrl: './adduniversity.component.scss'
})
export class AdduniversityComponent {

 private readonly _universityService = inject(UniversityService);
  unviersityForm!: FormGroup;


  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.unviersityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit(): void {
    if (this.unviersityForm.valid) {
      console.log('Form submitted:', this.unviersityForm.value);
      this._universityService.addUniversity(this.unviersityForm.value).subscribe({
       next: (res: any) => {
         console.log(res);
       },
       error: (err) => {
         console.log(err);
       },
      })
      // Here you would typically call your service to create the admin account
      this.unviersityForm.reset();
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.unviersityForm.controls).forEach(key => {
        const control = this.unviersityForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}