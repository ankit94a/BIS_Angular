import { Routes } from "@angular/router";
import { AttributeComponent } from "./attribute.component";
import { AuthGuard } from "projects/sharedlibrary/src/guard/auth-guard";

export const attributeRoutes: Routes = [{
  path: '',
  component: AttributeComponent,
  // children: [
  //   {
  //     path: '',
  //     redirectTo:'category',
  //     pathMatch:'prefix'
  //   },
  //   {
  //     path: 'category',
  //     loadComponent: () => import('./category/category.component').then(m=>m.CategoryComponent),
  //     canActivate: [AuthGuard]
  //   },
  //   {
  //     path: 'sub-category',
  //     loadComponent: () => import('.//sub-category/sub-category.component').then(m=>m.SubCategoryComponent),
  //     canActivate: [AuthGuard]
  //   },
  // ]

}]
