import { GuidelinsService } from '../../../../core/services/guidelins.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { HomeService } from '../../../../services/guest/home.service';
import { NgIf } from '@angular/common';
import { ImplicitReceiver } from '@angular/compiler';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-add-guide-lines',
  standalone: true,
  imports: [ReactiveFormsModule , NgIf ],
  templateUrl: './add-guide-lines.component.html',
  styleUrl: './add-guide-lines.component.scss'
})
export class AddGuideLinesComponent implements OnInit {
  private readonly _formBuilder= inject(FormBuilder)
  public readonly _AuthService = inject(AuthService)

  private readonly _GuidelinsService=inject(GuidelinsService)
  private readonly _HomeService=inject(HomeService)

  errmsg:string='';
  err:any=null
  result:any=[]
  text: string = '';
  id:any=null
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

  guidelineForm:FormGroup= this._formBuilder.group({
    guidelines: ['', Validators.required],
        file:[null]
  })

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




 

  ngOnInit(): void {
    this.fetchGuideline();
  }

  fetchGuideline(): void {
    this._GuidelinsService.getGuidelines().subscribe({
      next: (response: any) => {
        console.log('response.data.length:',response.data.length);
        if (response.data.length > 0) {
        
        this.id = response.data[0].guideLinesId; // Get the ID of the guideline for updating purposes
        console.log('Guideline ID:', this.id);
          this.guidelineExists = true; // Guideline exists
          this.guidelineForm.patchValue({ guidelines:response.data[0].guidelines}); // Populate the form
          
        }
      },
      error: (error) => {
        console.error('Error fetching guideline:', error);
      },
    });
  }

  // Save or update the guideline
  saveGuideline(): void {
    if (this.guidelineForm.invalid) return;

    const text = this.guidelineForm.value;
    if (this.guidelineExists) {
      // Update the existing guideline
      this._GuidelinsService.updateGuideline(this.id,text).subscribe({
        next: (response) => {
          this.Toast.fire({
            icon: 'success',
            title: 'تـم  تعديل الارشادات',
          })   
          console.log('Guideline updated:', response);
         this.guidelineForm.markAsPristine();

        },


        error: (error) => {
          console.error('Error updating guideline:', error);
        },
      });
    } else {
      // Create a new guideline
      this._GuidelinsService.setguideForm(this.guidelineForm.value).subscribe({
        next: (response:any) => {
          console.log('resssss:', response);
          this.id = response.data.guideLinesId; 
            this.Toast.fire({
            icon: 'success',
            title: 'تـم اضـافه الارشادات',
          })   
          console.log('Guideline created:', response);

          
          this.guidelineExists = true; // Update the state
            this.guidelineForm.markAsPristine();
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
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#750202',
      confirmButtonText: 'نعم، احذفه',
      cancelButtonText:'تراجع'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with deletion
        console.log('id for delete', this.id);
        this._GuidelinsService.deleteGuideline(this.id).subscribe({
          next: (response) => {
            // Show success message
            Swal.fire({
              title: 'حـذف!',
              text: 'تم حذف إرشاداتك.',
              icon: 'success',
            });
  
            // Additional logic after deletion
            console.log('Guideline deleted:', response);
            this.guidelineExists = false; // Update the state
            this.guidelineForm.reset(); // Clear the form
          },
          error: (error) => {
            // Show error message
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
