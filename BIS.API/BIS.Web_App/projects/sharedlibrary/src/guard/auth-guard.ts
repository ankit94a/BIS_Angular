import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthHelper } from '../helpers/auth-helper';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })

export class AuthGuard  {
  constructor(private helper: AuthService) { }
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.helper.isAuthenticated()) {
      return true;
    }
    else {
    //   this.helper.navigateToLogin(state.url);
      return false;
    }
  }
}

