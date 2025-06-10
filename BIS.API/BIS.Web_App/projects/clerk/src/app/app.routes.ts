import { Routes } from '@angular/router';
import { AuthGuard } from 'projects/sharedlibrary/src/guard/auth-guard';
import { PermissionGuard } from 'projects/sharedlibrary/src/guard/permission.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../layout/layout.routes').then(m => m.routes)
    },
    {
        path: 'login',
        loadComponent: () => import('../app/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'corps',
        loadComponent: () => import('projects/clerk/src/layout/corps-list/corps-list.component').then(m => m.CorpsListComponent),
        canActivate: [AuthGuard, PermissionGuard],
        data: { allowedRoles: ['10', '11', '12', '13', '14', '15'] },
    },
    // otherwise redirect to home
    { path: '**', redirectTo: 'login' }
    
];
