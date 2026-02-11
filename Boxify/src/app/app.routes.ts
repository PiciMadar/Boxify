import { Routes } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { BoxesComponent } from './components/system/boxes/boxes.component';

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
        path:'boxes',
        component:BoxesComponent
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
