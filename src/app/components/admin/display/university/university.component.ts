import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UniversityService } from '../../../../core/services/university.service';
import { Iuniversity } from '../../../../core/interfaces/iuniversity';
import { MatDialog } from '@angular/material/dialog';
import { UniversityFormComponent } from '../../../admin/forms/university-form/university-form.component';

@Component({
  selector: 'app-university',
  standalone: true,
  imports: [ReactiveFormsModule  ],
  templateUrl: './university.component.html',
  styleUrl: './university.component.scss'
})
export class UniversityComponent {

 private readonly _universityService = inject(UniversityService);
public  dialog = inject(MatDialog);
universities:Iuniversity[]=[];
university!: Iuniversity;
  unviersityForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.unviersityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
    this.getAllUniversity();
  }


  loaduniversity(university: Iuniversity) {
    this.university = university;
    this.openDialog(university);
  }




  getAllUniversity() {
    this._universityService.getAllUniversity().subscribe({
      next: (res: any) => {
        console.log("im here",res);
        this.universities = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  deleteUniversity(id: number) {
    this._universityService.deleteUniversity(id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.getAllUniversity();
      },
      error: (err) => {
        console.log(err);
      },
    })
  }


  openDialog(university?: Iuniversity): void {
      const dialogRef = this.dialog.open(UniversityFormComponent, {
        width: '50%', // Set the width of the dialog
        data: university || null, // Pass data to the dialog
        panelClass: 'custom-dialog-container'
  
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getAllUniversity(); // Refresh the list after the dialog is closed
        }
      });
    }
}