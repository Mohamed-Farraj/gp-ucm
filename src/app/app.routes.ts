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
import { AddDeadlineComponent } from './components/add-deadline/add-deadline.component';
import { DeadlinsFormComponent } from './components/deadlins-form/deadlins-form.component';

export const routes: Routes = [

    {path:"",redirectTo:"guest",pathMatch:"full"},
    {path:"guest",component:GuestLayoutComponent,children:[
    {path:"",redirectTo:"home",pathMatch:"full"},
    {path:"home",component:GuestHomeComponent},
    {path:"app-request",component:ApplicationRequestComponent},
    {path:"login",component:LoginComponent},
    {path:"app-request",component:ApplicationRequestComponent},
    {path:"add-deadline", component:AddDeadlineComponent},
    {path:"deadlines", component:DeadlinsFormComponent},

   
    ]},
    {path:"hu",component:HuLayoutComponent,children:[

    ]},
    {path:"hnu",component:HnuLayoutComponent,children:[

    ]},
    {path:"admin",component:AdminLayoutComponent,children:[
        {path:"",redirectTo:"admin-dashboard",pathMatch:"full"},
        {path:"admin-dashboard",component:AdminDashboardComponent},
        {path:"add-guide", component:AddGuideLinesComponent},


    ]},
    {path:"**",component:NotfoundComponent}

];
