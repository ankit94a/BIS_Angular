import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { AuthGuard } from "projects/sharedlibrary/src/guard/auth-guard";


export const routes: Routes = [

    {
        path:'',
        component:LayoutComponent,
        children:[
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch:'full'
        
              },
              {
                path: 'dashboard',
                loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
                canActivate: [AuthGuard],
              },
              {
                path:'master-data',
                loadComponent:() => import('./master-data/master-data-list/master-data.component').then(m => m.MasterDataComponent),
                canActivate: [AuthGuard],
              },
              {
                path:'create-data',
                loadComponent:() => import('./master-data/master-data-add/master-data-add.component').then(m => m.MasterDataAddComponent),
                canActivate: [AuthGuard],
              },
              {
                path:'login/forgotpassword',
                loadChildren:() => import('../app/forgotpassword/forgotpassword.component').then(m => m.ForgotpasswordComponent)
              },
              {
                path:'analysis',
                loadComponent: ()=> import('./smart-analysis/smart-analysis.component').then(m => m.SmartAnalysisComponent),
                canActivate: [AuthGuard],
              },
              {
                path:'saved-notes',
                loadComponent:() => import('./saved-notes/saved-notes.component').then(m => m.SavedNotesComponent),
                canActivate: [AuthGuard],
              },
              {
                path:'gen-report',
                loadComponent:() => import('./generate-report/generate-reports-list/generate-reports-list.component').then(m => m.GenerateReportsListComponent),
                canActivate: [AuthGuard],
              },
              {
                path:'cdr-dahboard',
                loadComponent:() => import('./cdr-dashboard/cdr-dashboard.component').then(m => m.CdrDashboardComponent),
                canActivate: [AuthGuard],
              },
              {
                path:'notes-for-me',
                loadComponent:() => import('./notes-for-me/notes-for-me.component').then(m => m.NotesForMeComponent),
                canActivate: [AuthGuard],
              },
              {
                path:'user-list',
                loadComponent:() => import('projects/sharedlibrary/src/component/user/user-list/user-list.component').then(m => m.UserListComponent),
                canActivate: [AuthGuard],
              },
              {
                path:'roles',
                loadComponent: () => import('projects/sharedlibrary/src/component/role/role-list/role-list.component').then(m => m.RoleListComponent),
                canActivate: [AuthGuard],
              },
              {
                path:'facility',
                loadComponent : () =>import('projects/sharedlibrary/src/component/facility/facility-list/facility-list.component').then(m => m.FacilityListComponent),
                // canActivate: [AuthGuard],
              }
        ]
    }
];