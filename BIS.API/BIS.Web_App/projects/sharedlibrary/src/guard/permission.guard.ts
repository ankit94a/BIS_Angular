import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,private location: Location ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.authService.getRoleType();
    const allowedRoles: string[] = route.data['allowedRoles'] || [];
    if (allowedRoles.includes(userRole)) {
      return true;
    } else {
      this.router.navigate(['/forbidden']);
      return false;
    }
  }
}
