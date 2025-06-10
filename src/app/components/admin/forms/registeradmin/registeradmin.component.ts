import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { create } from 'domain';
import { AdminService } from '../../../../core/services/admin.service';
import { CommonModule, NgFor } from '@angular/common';
import { Iadmin } from '../../../../core/interfaces/iadmin';
import { AuthService } from '../../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateAdminFormComponent } from '../create-admin-form/create-admin-form.component';
import { PrivilegesService } from '../../../../core/services/privileges.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddPrivFormComponent } from '../add-priv-form/add-priv-form.component';
import { Ipriv } from '../../../../core/interfaces/ipriv';
import { PaginationService } from '../../../../services/pagination.service';

@Component({
  selector: 'app-registeradmin',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule , NgSelectModule,NgFor],
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
    private readonly pagination = inject(PaginationService);


     //#region pagination attributes
      selectedAdmissionRequest: any = {};
      // pagedItems: any[] = [];
      currentPage: number = 1;
      pageSize: number = 20;
      totalPages: number = 0;
      pages: number[] = [];
      currentPagesArray:number[] = [];
      meta: any = {};
      displayedPages: number[] = [];
      //#endregion



      
    //#region pagination methods
    initPagination(): void {
      this.totalPages = this.meta?.totalPages;
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.currentPagesArray = this.pagination.getDisplayedPages(this.totalPages, this.currentPage);
    }
  
    changePage(page: number): void {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.updateDisplayedPages(); // تحديث الصفحات المعروضة
      this.getAllAdmins({'offset':this.currentPage-1});
     
    }
  
    getDisplayedPages(): number[] {
      console.log(this.pagination.getDisplayedPages(this.totalPages, this.currentPage));
      return this.currentPagesArray;
    }

    updateDisplayedPages(): void {
        // شيك لو إجمالي الصفحات صفر
              console.log(this.totalPages); // هيتنفذ مرة واحدة بس وقت التحديث

  if (!this.totalPages) {
    this.displayedPages = [];
      console.log(this.displayedPages); // هيتنفذ مرة واحدة بس وقت التحديث
      return;
  }
  this.displayedPages = this.pagination.getDisplayedPages(this.totalPages, this.currentPage);
  console.log(this.displayedPages); // هيتنفذ مرة واحدة بس وقت التحديث
  }

    //#endregion
  


 privilegeNames: { [key: string]: string } = {
  ACCESS_ACCOMMODATION: 'الوصول إلى السكن',
  ACCESS_ASSIGNMENT: 'الوصول إلى المهام',
  // زود أي صلاحيات تانية
};
     ngOnInit(): void {
    this.getAllAdmins();
  }

  getAllAdmins({  offset }: {  offset?: number } = {}){
    this._adminService.getAllAdmins(offset).subscribe({
      next: (res:any) => {
        console.log("allllllllll adiiiiiiiimn",res);
        if (res.data) {
          this.admins = res.data;
          this.meta = res?.meta;
          console.log(this.admins);
        }
        this.initPagination();
        this.updateDisplayedPages();

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
        this.getAllAdmins({'offset':this.currentPage-1})
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
          this.getAllAdmins({'offset':this.currentPage-1}); // Refresh the list after the dialog is closed
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