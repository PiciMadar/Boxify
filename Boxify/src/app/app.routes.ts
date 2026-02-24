import { Routes } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { BoxesComponent } from './components/system/boxes/boxes.component';
import { UserControlComponent } from './components/admin/user-control/user-control.component';
import { DashboardComponent } from './components/system/dashboard/dashboard.component';
import { ItemsComponent } from './components/system/items/items.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'forgotPass',
        component:ForgotPasswordComponent
    },
    {
        path: 'box', canActivate: [authGuard],
        children:[
            {
                path:'boxes', component:BoxesComponent
            },
            {
                path:'items', component:ItemsComponent
            }
        ]
    },
    {
        path: 'user-control', canActivate: [roleGuard], data: {role: 'admin'},
        component: UserControlComponent
    },
    {
        path: 'dashboard',
        component:DashboardComponent
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
