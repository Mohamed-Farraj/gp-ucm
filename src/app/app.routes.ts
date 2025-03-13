import { Routes } from '@angular/router';
import { GuestLayoutComponent } from './layouts/guest-layout/guest-layout.component';
import { HuLayoutComponent } from './layouts/hu-layout/hu-layout.component';
import { HnuLayoutComponent } from './layouts/hnu-layout/hnu-layout.component';
import path from 'path';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AcceptanceStatusComponent } from './components/acceptance-status/acceptance-status.component';
import { ApplicationRequestComponent } from './components/application-request/application-request.component';
import { LoginComponent } from './components/login/login.component';
import { AddGuideLinesComponent } from './components/add-guide-lines/add-guide-lines.component';
  
import { GuestHomeComponent } from './components/guest-home/guest-home.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';
import { AddDeadlineComponent } from './components/add-deadline/add-deadline.component';
import { DeadlinsFormComponent } from './components/deadlins-form/deadlins-form.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [

    {path:"",redirectTo:"guest",pathMatch:"full"},
    {path:"guest",component:GuestLayoutComponent,children:[
    {path:"",redirectTo:"home",pathMatch:"full"},
    {path:"home",component:GuestHomeComponent},
    {path:"app-request",component:ApplicationRequestComponent},
    {path:"app-request",component:ApplicationRequestComponent},
    {path:"login",canActivate:[loggedGuard],component:LoginComponent},
   
    ]},
    {path:"hu",component:HuLayoutComponent, canActivate:[authGuard] ,children:[
        {path:"",redirectTo:"user-dashboard",pathMatch:"full"},
        {path:"user-dashboard",component:UserDashboardComponent},
    ]},
    {path:"hnu",component:HnuLayoutComponent,children:[

    ]},
    {path:"admin",component:AdminLayoutComponent, canActivate:[],children:[
        {path:"",redirectTo:"admin-dashboard",pathMatch:"full"},
        {path:"admin-dashboard",component:AdminDashboardComponent},
        {path:"add-guide", component:AddGuideLinesComponent},


    ]},
    {path:"**",component:NotfoundComponent}

];
