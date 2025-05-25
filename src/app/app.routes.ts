import { Routes } from '@angular/router';
import { GuestLayoutComponent } from './layouts/guest-layout/guest-layout.component';
import { HuLayoutComponent } from './layouts/hu-layout/hu-layout.component';
import { HnuLayoutComponent } from './layouts/hnu-layout/hnu-layout.component';
import path from 'path';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AcceptanceStatusComponent } from './components/index/acceptance-status/acceptance-status.component';
import { ApplicationRequestComponent } from './components/application-request/application-request.component';
import { LoginComponent } from './components/index/login/login.component';
import { AddGuideLinesComponent } from './components/admin/forms/add-guide-lines/add-guide-lines.component';
  
import { GuestHomeComponent } from './components/index/guest-home/guest-home.component';
import { AdminDashboardComponent } from './components/admin/display/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/student/user-dashboard/user-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';
import { AddDeadlineComponent } from './components/admin/forms/add-deadline/add-deadline.component';
import { DeadlinsFormComponent } from './components/admin/forms/deadlins-form/deadlins-form.component';
import { adminGuard } from './core/guards/admin.guard';
import { UserLandingPageComponent } from './components/student/user-landing-page/user-landing-page.component';
import { DisplayComplaintsComponent } from './components/admin/display/display-complaints/display-complaints.component';
import { ArDisplayComponent } from './components/admin/display/ar-display/ar-display.component';
import { TableViewUsersListComponent } from './components/admin/display/table-view-users-list/table-view-users-list.component';
import { GuidlinesComponent } from './components/index/guidlines/guidlines.component';
import { ApplicationDeadlineComponent } from './components/index/application-deadline/application-deadline.component';
import { PenaltyComponent } from './components/admin/forms/penalty/penalty.component';
import { RoomsComponent } from './components/admin/display/rooms/rooms.component';
import { BuildingsListComponent } from './components/admin/display/buildings-list/buildings-list.component';
import { AdminLandingPageComponent } from './components/admin/display/admin-landing-page/admin-landing-page.component';
import { AddPenaltyComponent } from './components/admin/forms/add-penalty/add-penalty.component';
import { AssignRoomsComponent } from './components/admin/display/assign-rooms/assign-rooms.component';
import { MealsComponent } from './components/admin/display/meals/meals.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { LogsComponent } from './components/admin/display/logs/logs.component';

import { registeradminComponent } from './components/admin/forms/registeradmin/registeradmin.component';

export const routes: Routes = [

    {path:"",redirectTo:"guest",pathMatch:"full"},
    
    {path:"guest",component:GuestLayoutComponent,children:[
    {path:"",redirectTo:"home",pathMatch:"full"},
    {path:"home",component:GuestHomeComponent},

    {path:"app-request",component:ApplicationRequestComponent},
    {path:"login",canActivate:[loggedGuard],component:LoginComponent},


        
    ]},
    {path:"hu",component:HuLayoutComponent, canActivate:[authGuard] ,children:[
        {path:"",redirectTo:"user-dashboard",pathMatch:"full"},
        {path:"user-dashboard",component:UserDashboardComponent,},
        {path:"complaints",component:DisplayComplaintsComponent},
        {path:"app-request",component:ApplicationRequestComponent},

    ]},
    {path:"hnu",component:HnuLayoutComponent,children:[

    ]},
    {path:"admin",component:AdminLayoutComponent, canActivate:[adminGuard],children:[
        {path:"",redirectTo:"home",pathMatch:"full"},
        {path:"home",component:AdminLandingPageComponent},
        {path:"stepper",component:StepperComponent},
        {path:"ar",component:TableViewUsersListComponent},
        {path:"details/:id",component:ArDisplayComponent},
        {path:"guidelines",component:AddGuideLinesComponent},
        {path:"deadline", component:DeadlinsFormComponent},
        {path:"penalty",component:AddPenaltyComponent},
        {path:"complaints",component:DisplayComplaintsComponent},
        {path:'buildings',component: RoomsComponent,},
        {path:'assign-to-rooms',component: AssignRoomsComponent,},
        {path:'meals',component: MealsComponent,},
        {path:'logs',component:LogsComponent},
        {path:'register-admin',component:registeradminComponent,},

        {path:'',component: BuildingsListComponent, outlet: 'side' },

    ]},
    {path:"**",component:NotfoundComponent},




];
