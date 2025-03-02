import { Routes } from '@angular/router';
import { GuestLayoutComponent } from './layouts/guest-layout/guest-layout.component';
import { HuLayoutComponent } from './layouts/hu-layout/hu-layout.component';
import { HnuLayoutComponent } from './layouts/hnu-layout/hnu-layout.component';
import path from 'path';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AcceptanceStatusComponent } from './components/acceptance-status/acceptance-status.component';
import { ApplicationRequestComponent } from './components/application-request/application-request.component';
import { GuestHomeComponent } from './components/guest-home/guest-home.component';

export const routes: Routes = [

    {path:"",redirectTo:"guest",pathMatch:"full"},

    {path:"guest",component:GuestLayoutComponent,children:[
    {path:"",redirectTo:"home",pathMatch:"full"},
    {path:"home",component:GuestHomeComponent},
    {path:"app-request",component:ApplicationRequestComponent},
    ]},
    {path:"hu",component:HuLayoutComponent,children:[

    ]},
    {path:"hnu",component:HnuLayoutComponent,children:[

    ]},
    {path:"admin",component:AdminLayoutComponent,children:[

    ]},
    {path:"**",component:NotfoundComponent}

];
