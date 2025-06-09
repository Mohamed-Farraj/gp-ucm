import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { create } from 'domain';
import { AdminService } from '../../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { Iadmin } from '../../../../core/interfaces/iadmin';
import { AuthService } from '../../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateAdminFormComponent } from '../create-admin-form/create-admin-form.component';
import { PrivilegesService } from '../../../../core/services/privileges.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddPrivFormComponent } from '../add-priv-form/add-priv-form.component';
import { Ipriv } from '../../../../core/interfaces/ipriv';

@Component({
  selector: 'app-registeradmin',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule , NgSelectModule],
templateUrl: './registeradmin.component.html',
  styleUrl: './registeradmin.component.scss'
})
export class registeradminComponent implements OnInit {
  isModelOpen = false;
  admins: Iadmin[] = [];
  admin!: Iadmin;
  privilages: Ipriv[] = [];
  privilage!: Ipriv;
   private readonly _adminService = inject(AdminService);
   public readonly _AuthService = inject(AuthService)
   private readonly _PrivilegeService = inject(PrivilegesService)
   private readonly _Privi=inject(PrivilegesService)
    private readonly _formBuilder= inject(FormBuilder)
    public  dialog = inject(MatDialog);




 privilegeNames: { [key: string]: string } = {
  ACCESS_ACCOMMODATION: 'الوصول إلى السكن',
  ACCESS_ASSIGNMENT: 'الوصول إلى المهام',
  // زود أي صلاحيات تانية
};
     ngOnInit(): void {
    this.getAllAdmins();
  }

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
        console.log('privileges ressss',res);
        this.privilages = res.data;
        console.log('privileges array',this.privilages);
      },
    });
  }




getPrivilegeNames(privileges: any[]): string {
  if (!privileges || !Array.isArray(privileges)) return '';
  return privileges
    .map(p => this.privilegeNames[p.name] || p.name || '')
    .join(', ');
}


// loadprivilege(userId: number, admin: Iadmin , revokeMode = true) {
//     admin = admin;
//     this.openRevokePrivDialog( userId, admin , revokeMode);
//   }



  // revokePrivilegeFormUser() {
  //     this._Privi.revokePrivilegesFormUser(id).subscribe({
  //       next: (res: any) => {
    
  //         // Remove the deleted deadline from the local array
  //         this.admins = this.admins.filter(deadline => this.admin.userID !== id);
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       },
  //     });
  //   }
  
    // updateDeadline(id:number , admin: Iadmin) {
    //   this._Privi.revokePrivileges(id,deadline).subscribe({
    //     next: (res:any) => {
    //       this.getDeadLine();
    //     },
    //     error: (err) => {console.log(err);},
    //   });
    // }
  


  revokeAllPrivileges(id: number) {
    this._Privi.revokeAllPrivilegesFormUser(id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.getAllAdmins()
      },
      error: (err) => {
        console.log(err);
      },
    });
  }




  openDialog(admin?: Iadmin): void {
      const dialogRef = this.dialog.open(CreateAdminFormComponent, {
        width: '50%', // Set the width of the dialog
        data: admin || null, // Pass data to the dialog
        panelClass: 'custom-dialog-container'
  
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getAllAdmins(); // Refresh the list after the dialog is closed
        }
      });
    }



openPrivDialog(userId: number, admin?: Iadmin) : void {
  const dialogRef = this.dialog.open(AddPrivFormComponent, {
    width: '50%',
    data: {
      userId,
      admin,
      privilegeIds: admin?.privileges?.map(p => p.id) || [],
      revokeMode: false
    },
    panelClass: 'custom-dialog-container'
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) this.getAllAdmins();
  });
}

openRevokePrivDialog(userId: number, admin?: Iadmin ) : void {
  const dialogRef = this.dialog.open(AddPrivFormComponent, {
    width: '50%',
    data: {
      userId,
      admin,
      privilegeIds: [], // فاضي
      revokeMode: true
    },
    panelClass: 'custom-dialog-container'
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) this.getAllAdmins();
  });
}



}