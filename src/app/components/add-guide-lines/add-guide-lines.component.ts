import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GuidelinsService } from '../../core/services/guidelins.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-guide-lines',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-guide-lines.component.html',
  styleUrl: './add-guide-lines.component.scss'
})
export class AddGuideLinesComponent {
  private readonly _formBuilder= inject(FormBuilder)
  private readonly _GuidelinsService=inject(GuidelinsService)
  errmsg:string='';
  
  addguideForm:FormGroup= this._formBuilder.group({
    guidelines:[null ],
    file:[null]
  })


  setguideline(){
     
        console.log(this.addguideForm.value)
        this._GuidelinsService.setguideForm(this.addguideForm.value).subscribe({
          next:(res:any)=>{
               this.errmsg=res.body.message
            console.log(res)
          },
    
          error:(err:HttpErrorResponse)=>{
            
            console.log(err)
    
          }
    
        })
          console.log(this.addguideForm)
      
  }
}
