import { Routes } from '@angular/router';
import { GuestLayoutComponent } from './layouts/guest-layout/guest-layout.component';
import { HuLayoutComponent } from './layouts/hu-layout/hu-layout.component';
import { HnuLayoutComponent } from './layouts/hnu-layout/hnu-layout.component';
import path from 'path';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AcceptanceStatusComponent } from './components/acceptance-status/acceptance-status.component';
import { AppRequestComponent } from './components/app-request/app-request.component';
import { ApplicationRequestComponent } from './components/application-request/application-request.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {path:"app-request",component:ApplicationRequestComponent},
    {path:"login",component:LoginComponent},


    {path:"",redirectTo:"guest",pathMatch:"full"},

    {path:"guest",component:GuestLayoutComponent,children:[

        {path:"acceptance-status",component:AcceptanceStatusComponent},   


    ]},
    {path:"hu",component:HuLayoutComponent,children:[

    ]},
    {path:"hnu",component:HnuLayoutComponent,children:[

    ]},
    {path:"admin",component:AdminLayoutComponent,children:[

    ]},
    {path:"**",component:NotfoundComponent}

];
