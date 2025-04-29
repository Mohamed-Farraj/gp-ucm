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
import { UserLandingPageComponent } from './components/user-landing-page/user-landing-page.component';
import { DisplayComplaintsComponent } from './components/display-complaints/display-complaints.component';
import { ArDisplayComponent } from './components/ar-display/ar-display.component';
import { TableViewUsersListComponent } from './components/table-view-users-list/table-view-users-list.component';
import { GuidlinesComponent } from './components/guidlines/guidlines.component';
import { ApplicationDeadlineComponent } from './components/application-deadline/application-deadline.component';
import { PenaltyComponent } from './components/penalty/penalty.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { BuildingsListComponent } from './components/buildings-list/buildings-list.component';
import { AdminLandingPageComponent } from './components/admin-landing-page/admin-landing-page.component';
import { AddPenaltyComponent } from './components/add-penalty/add-penalty.component';
import { MealsComponent } from './components/meals/meals.component';
import { StepperComponent } from './components/stepper/stepper.component';


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
        {path:'meals',component: MealsComponent,},
        {path:'',component: BuildingsListComponent, outlet: 'side' },

    ]},
    {path:"**",component:NotfoundComponent},




];
