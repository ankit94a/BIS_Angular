import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    loadComponent : () => import('../layout/login/login.component').then(m => m.LoginComponent)
  },
  {
    path:'corps',
    loadComponent : () => import('../layout/corps-list/corps-list.component').then(m => m.CorpsListComponent)
  }
];
