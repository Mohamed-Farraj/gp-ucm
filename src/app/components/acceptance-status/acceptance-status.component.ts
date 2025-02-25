import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-acceptance-status',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './acceptance-status.component.html',
  styleUrl: './acceptance-status.component.scss'
})
export class AcceptanceStatusComponent {


  // constructor(private _call:CallService) { }
  @ViewChild('no') reject!:ElementRef;
  @ViewChild('yes') accept!:ElementRef;
  @ViewChild('pending') pending!:ElementRef;
  @ViewChild('cstm') cstm!:ElementRef;
  studentId:string="";
  isvalid:boolean=false;
  hiderule:boolean = true;
  userN!:string
  userimg!:string
  apirespons:any
  alertmsg!:string
  isRejectd:boolean = false

  ngAfterViewInit() {

    this.hideall();

  }

  checkvalidty(){
    if(/^\d{14}$/.test(this.studentId))
    {
      this.isvalid = true;
      // this.hiderule = true;
    }
    else{
      this.isvalid = false;
    }
  }

  hideall()
  {
    this.reject.nativeElement.classList.add('d-none');
    this.accept.nativeElement.classList.add('d-none');
    this.pending.nativeElement.classList.add('d-none');
    this.cstm.nativeElement.classList.add('d-none');
  }

  rejected()
  {
    this.reject.nativeElement.classList.remove('d-none');
    this.accept.nativeElement.classList.add('d-none');
    this.pending.nativeElement.classList.add('d-none');
    this.cstm.nativeElement.classList.add('d-none');
  }
  accepted()
  {
    this.reject.nativeElement.classList.add('d-none');
    this.accept.nativeElement.classList.remove('d-none');
    this.pending.nativeElement.classList.add('d-none');
    this.cstm.nativeElement.classList.add('d-none');
  }

  pended()
  {
    this.reject.nativeElement.classList.add('d-none');
    this.accept.nativeElement.classList.add('d-none');
    this.pending.nativeElement.classList.remove('d-none');
    this.cstm.nativeElement.classList.add('d-none');
  }
  cstmed()
  {
    this.reject.nativeElement.classList.add('d-none');
    this.accept.nativeElement.classList.add('d-none');
    this.pending.nativeElement.classList.add('d-none');
    this.cstm.nativeElement.classList.remove('d-none');
  }

  rules(){
    this.hiderule = !this.hiderule;
  }

  ask()
   {
  //   console.log(this.studentId);
  //   this._call.callidapi(this.studentId).subscribe({
  //     next:(resdata:any)=>{
  //       this.apirespons=resdata;
  //       this.userN = this.apirespons?.name
  //       // this.accepted();
  //       console.log(resdata);
  //       if (this.apirespons.acceptanceStatus === "لم يستدل عليه") {
  //         this.pended()
  //       }
  //       else if(this.apirespons.message === "Student Not Found")
  //       {
  //         this.rejected()
  //         this.isRejectd = false
  //       }
  //       else if(this.apirespons.acceptanceStatus === "مرفوض")
  //       {
  //         this.rejected()
  //         this.isRejectd = true
  //       }
  //       else if(this.apirespons.acceptanceStatus === "مقبول")
  //       {
  //         this.accepted()
  //       }
  //       else{
  //         this.alertmsg = this.apirespons.acceptanceStatus
  //         this.cstmed()
  //       }
  //     },
  //     error:(errdata:any)=>{
  //       console.log(errdata);
  //       this.rejected();
  //     }
  //   })
   }


}
