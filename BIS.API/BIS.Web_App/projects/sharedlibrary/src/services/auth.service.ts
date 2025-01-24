import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('BIS_TOKEN');
    return token ? true : false;
  }
  setUserDetails(user){
    localStorage.setItem("BIS_RoleType",user.roleType);
    localStorage.setItem("BIS_UserName",user.userName);
    localStorage.setItem("BIS_CorpsName",user.corpsName);
    localStorage.setItem("BIS_DivisionName",user.divisionName);
  }
  setToken(token:string){
    localStorage.setItem("BIS_TOKEN",token);
  }

  getToken(){
    return localStorage.getItem("BIS_TOKEN");
  }
  // setUserName(name:string){
  //   localStorage.setItem("BIS_UserName",name);
  // }
  // setUserRole(name:string){
  //   localStorage.setItem("BIS_UserRole",name);
  // }
  getUserName(){
    return localStorage.getItem("BIS_UserName");
  }
  getRoleType(){
    return localStorage.getItem("BIS_RoleType");
  }
  getCorpsName(){
    return localStorage.getItem("BIS_CorpsName");
  }
  getDivisionName(){
    return localStorage.getItem("BIS_DivisionName");
  }
  clear() {
    localStorage.removeItem('BIS_TOKEN');
    localStorage.removeItem('BIS_RoleType');
    localStorage.removeItem('BIS_CorpsName');
    localStorage.removeItem('BIS_DivisionName');
    this.navigateToLogin(this.router.routerState.snapshot.url);
    
  }
  public navigateToLogin(stateUrl) {

    //   this._injector.get(ValidatepermissionService).set();

       this.router.navigate(['/login'], { queryParams: { queryParams: { returnUrl: stateUrl } } });

   }
}
