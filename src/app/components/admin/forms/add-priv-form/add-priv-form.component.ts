import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../../../core/services/admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrivilegesService } from '../../../../core/services/privileges.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ipriv } from '../../../../core/interfaces/ipriv';
import { Iadmin } from '../../../../core/interfaces/iadmin';

@Component({
  selector: 'app-add-priv-form',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule , NgSelectModule ],
templateUrl: './add-priv-form.component.html',
  styleUrl: './add-priv-form.component.scss'
})
export class AddPrivFormComponent {
 dialogRef = inject(MatDialogRef<AddPrivFormComponent>);
 data = inject<{ admin: Iadmin; privilegeIds: number[]; userId: number , revokeMode?: boolean}>(MAT_DIALOG_DATA);

  private readonly _adminService = inject(AdminService);
  private readonly _PrivilegeService = inject(PrivilegesService);
   privForm!: FormGroup;
   Privilegeives: Ipriv[] = [];
  privilage!: Ipriv;
  admins: Iadmin[] = [];
  revokeMode=false
   constructor(private fb: FormBuilder) {}


 privilegeNames: { [key: string]: string } = {
  ACCESS_ADD_ROOMS: 'إضافة غرف',
  ACCESS_DELETE_ROOMS: 'حذف غرف',
  ACCESS_VIEW_AVAILABLE_ROOMS: 'عرض الغرف المتاحة',
  ACCESS_REMOVE_STUDENT_FROM_ROOM: 'إزالة طالب من الغرفة',

  ACCESS_LOGS: 'سجلات النظام',

  ACCESS_ADMISSION_ANALYSIS: 'تحليل القبول',

  ACCESS_EXPORT_ADMISSION: 'تصدير بيانات القبول',
  ACCESS_EXPORT_SORTED_ADMISSION: 'تصدير القبول المرتب',

  ACCESS_UPLOAD_ADMISSION_SECURITY_CHECK: 'رفع فحص الأمان للقبول',
  ACCESS_UPLOAD_ADMISSION_STATUS: 'رفع حالة القبول',

  ACCESS_ADD_APPLICATION_DEADLINES: 'إضافة مواعيد التقديم',
  ACCESS_DELETE_APPLICATION_DEADLINES: 'حذف مواعيد التقديم',
  ACCESS_UPDATE_APPLICATION_DEADLINES: 'تحديث مواعيد التقديم',

  ACCESS_UPDATE_GUIDELINES: 'تحديث الإرشادات',
  ACCESS_ADD_GUIDELINES: 'إضافة إرشادات',
  ACCESS_DELETE_GUIDELINES: 'حذف إرشادات',

  ACCESS_ADD_BUILDINGS: 'إضافة مباني',
  ACCESS_VIEW_BUILDINGS: 'عرض المباني',
  ACCESS_DELETE_BUILDINGS: 'حذف مباني',

  ACCESS_MANAGE_MEALS: 'إدارة الوجبات',

  ACCESS_ADD_PENALTY: 'إضافة عقوبة',
  ACCESS_VIEW_PENALTY: 'عرض العقوبات',
  ACCESS_DELETE_PENALTY: 'حذف عقوبة',

  ACCESS_UPLOAD_ROOM_ASSIGNMENT: 'رفع توزيع الغرف',
  ACCESS_EXPORT_AVAILABLE_ROOM: 'تصدير الغرف المتاحة',

  ACCESS_VIEW_ACCEPTED_STUDENTS: 'عرض الطلاب المقبولين',

  ACCESS_ADD_UNIVERSITY: 'إضافة جامعة',
  ACCESS_DELETE_UNIVERSITY: 'حذف جامعة',
  ACCESS_UPDATE_UNIVERSITY: 'تحديث بيانات الجامعة',
  ACCESS_VIEW_UNIVERSITY: 'عرض الجامعات',

   ACCESS_VIEW_APPEALS: 'عرض التظلمات',
  ACCESS_UPDATE_APPEAL_STATUS: 'تحديث حالة التظلم',
  ACCESS_VIEW_COMPLAINTS: 'عرض الشكاوى',
  ACCESS_DELETE_COMPLAINTS: 'حذف الشكاوى',
  ACCESS_VIEW_ADMISSION_REQUESTS: 'عرض طلبات الالتحاق',
  ACCESS_VIEW_ADMINS: 'عرض المشرفين',
  ACCESS_UPDATE_ADMISSION_REQUEST_STATUS: 'تحديث حالة طلب الالتحاق',
};


 
ngOnInit(): void {
  this.revokeMode = this.data?.revokeMode ?? false; // خد القيمة من الداتا أو false
  this.privForm = this.fb.group({
    userId: [this.data.userId, [Validators.required]],
    privilegeIds: [
      this.data.privilegeIds || [], // أهم نقطة: خدها زي ما جات من الداتا مش من admin
      [Validators.required]
    ],
  });

  this.getAllPrivileges();
  this.getAllAdmins();
}


//    ngOnChanges(): void {
//   if (this.data) {
//     this.privForm.patchValue({
//   userId: this.data.userId,
//   privilegeIds: this.data.admin.privileges.map((p) => p.id) || []
// });
//   }
// }



getAllAdmins(){
    this._adminService.getAllAdmins().subscribe({
      next: (res:any) => {
        console.log("allllllllll adiiiiiiiimn",res);
        if (res.data) {
          this.admins = res.data;
          console.log(this.admins);
        }
      },
      error: (err) => {console.log(err);},
    });
  }



 
 getAllPrivileges() {
  this._PrivilegeService.getAllPrivileges().subscribe({
    next: (res: any) => {
      console.log('privileges response:', res);
      // استخدم res.data أو res حسب شكل الريسبونس
      const arr = res.data || res || [];
      this.Privilegeives = arr.map((priv: any) => ({
        ...priv,
 nameAr: this.privilegeNames[priv.privilegeName] || priv.privilegeName      }));
      console.log('Privilegeives:', this.Privilegeives);
    }
  });
}


getPrivilegeNames(privileges: any[]): string {
  if (!privileges || !Array.isArray(privileges)) return '';
  return privileges.map(p => p.name || p.privilegeName || '').join(', ');
  
}

  onSubmit() {
  console.log(this.privForm.value);
  if (this.privForm.valid) {
    if (this.revokeMode) {
      // إلغاء الصلاحيات
      this._PrivilegeService.revokePrivilegesFormUser(this.privForm.value).subscribe({
        next: (res: any) => {
          this.dialogRef.close(true);
        },
      });
    } else {
      // إضافة الصلاحيات
      this._PrivilegeService.assignPrivileges(this.privForm.value).subscribe({
        next: (res: any) => {
          this.dialogRef.close(true);
        },
      });
    }
  } else {
    this.privForm.markAllAsTouched();
  }
}

 

  onClose() {
    this.dialogRef.close(false); // Close the dialog without saving
  }

  resetAdminForm() {
    this.privForm.reset();
    this.onClose();
  }
 
    


}
