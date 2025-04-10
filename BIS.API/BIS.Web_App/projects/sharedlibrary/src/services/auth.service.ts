import { Injectable, signal } from '@angular/core';
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
    localStorage.setItem("BIS_DivisionId",user.divisionId);
    localStorage.setItem("BIS_CorpsId",user.corpsId);
  }
  setToken(token:string){
    localStorage.setItem("BIS_TOKEN",token);
  }
  setCorpsName(name){
    localStorage.setItem("BIS_CorpsName",name);
  }
  setCorpsId(id){
    localStorage.setItem("BIS_CorpsId",id);
  }
  getToken(){
    return localStorage.getItem("BIS_TOKEN");
  }
  getUserName(){
    return localStorage.getItem("BIS_UserName");
  }
  getRoleType(){
    return localStorage.getItem("BIS_RoleType");
  }
  getCorpsName(){
    return signal(localStorage.getItem("BIS_CorpsName"));
  }
  getCorpsId(){
    return localStorage.getItem("BIS_CorpsId");
  }
  getDivisionId(){
    return localStorage.getItem("BIS_DivisionId");
  }
  getDivisionName(){
    return localStorage.getItem("BIS_DivisionName");
  }
  isDivisionUser(){
    if(this.getDivisionName() != 'null'){
      return true;
    }
    return false;
  }
  clear() {
    localStorage.removeItem('BIS_TOKEN');
    localStorage.removeItem('BIS_RoleType');
    localStorage.removeItem('BIS_CorpsName');
    localStorage.removeItem('BIS_DivisionName');
    localStorage.removeItem('BIS_UserName');
    this.navigateToLogin(this.router.routerState.snapshot.url);

  }
  public navigateToLogin(stateUrl) {
    this.router.navigate(['/login'], { queryParams: { queryParams: { returnUrl: stateUrl } } });
  }
}
