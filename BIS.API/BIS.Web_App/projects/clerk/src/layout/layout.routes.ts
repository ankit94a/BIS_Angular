import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { AuthGuard } from "projects/sharedlibrary/src/guard/auth-guard";
import { PermissionGuard } from "projects/sharedlibrary/src/guard/permission.guard";
import { ForbiddenComponent } from "./forbidden/forbidden.component";


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
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['2','3','4','7','10'] },
              },
              {
                path:'master-data',
                loadComponent:() => import('./master-data/master-data-list/master-data.component').then(m => m.MasterDataComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['1','2','3','4','7'] },
              },
              {
                path:'create-data',
                loadComponent:() => import('./master-data/master-data-add/master-data-add.component').then(m => m.MasterDataAddComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['1','2','3','4','7'] },
              },
              {
                path:'login/forgotpassword',
                loadChildren:() => import('../app/forgotpassword/forgotpassword.component').then(m => m.ForgotpasswordComponent)
              },
              {
                path:'smart-analysis',
                loadComponent: ()=> import('./smart-analysis/smart-analysis.component').then(m => m.SmartAnalysisComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['2','3','4','7'] },
              },
              {
                path:'saved-notes',
                loadComponent:() => import('./saved-notes/saved-notes.component').then(m => m.SavedNotesComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['2','3','4','7'] },
              },
              {
                path:'gen-report',
                loadComponent:() => import('./generate-report/generate-reports-list/generate-reports-list.component').then(m => m.GenerateReportsListComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['2','3','4','7'] },
              },
              {
                path:'cdr-dahboard',
                loadComponent:() => import('./cdr-dashboard/cdr-dashboard.component').then(m => m.CdrDashboardComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['7'] },
              },
              {
                path:'notes-for-me',
                loadComponent:() => import('./notes-for-me/notes-for-me.component').then(m => m.NotesForMeComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['2','3','4','7'] },
              },
              {
                path:'user-list',
                loadComponent:() => import('projects/sharedlibrary/src/component/user/user-list/user-list.component').then(m => m.UserListComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['2','3','4','7'] },
              },
              {
                path:'roles',
                loadComponent: () => import('projects/sharedlibrary/src/component/role/role-list/role-list.component').then(m => m.RoleListComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['2','3','4','7'] },
              },
              {
                path:'facility',
                loadComponent : () =>import('projects/sharedlibrary/src/component/facility/facility-list/facility-list.component').then(m => m.FacilityListComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['2','3','4','7'] },
              }
              ,
              {
                path:'master-data-form',
                loadComponent : () =>import('projects/clerk/src/layout/master-data/master-data-form/master-data-form.component').then(m => m.MasterDataFormComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['1','2','3','4','7'] },
              }
              ,
              {
                path:'approved-reports',
                loadComponent : () =>import('projects/clerk/src/layout/approved-report/approved-report-add/approved-reports.component').then(m => m.ApprovedReportsComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['2','3','4','7'] },
              },
              {
                path:'attribute',
                loadComponent : () =>import('projects/clerk/src/layout/attribute/attribute.component').then(m => m.AttributeComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['8'] },
              },
              {
                path:'corps',
                loadComponent : () =>import('projects/clerk/src/layout/corps-list/corps-list.component').then(m => m.CorpsListComponent),
                canActivate: [AuthGuard,PermissionGuard],
                data: { allowedRoles: ['10','11','12','13','14','15'] },
              },
              {
                path: 'forbidden',
                component: ForbiddenComponent
              }

        ]
    }
];
