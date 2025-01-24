import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../layout/layout.routes').then(m => m.routes)
    },
    {
        path: 'login',
        loadComponent: () => import('../app/login/login.component').then(m => m.LoginComponent)
    },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
