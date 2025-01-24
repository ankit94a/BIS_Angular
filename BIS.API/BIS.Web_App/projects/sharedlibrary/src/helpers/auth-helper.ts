import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";


@Injectable({ providedIn: 'root' })

export class AuthHelper {
    private authenticationChanged = new Subject<boolean>();
    constructor(private router: Router, private _injector: Injector,
    ) {
    }
    public isAuthenticated(): boolean {
        return (!(window.localStorage['bis_token'] === undefined ||
            window.localStorage['bis_token'] === null ||
            window.localStorage['bis_token'] === 'null' ||
            window.localStorage['bis_token'] === 'undefined' ||
            window.localStorage['bis_token'] === ''));
    }
    public isAuthenticationChanged(): any {
        return this.authenticationChanged.asObservable();
    }
    public getToken(): any {
        if (window.localStorage['bis_token'] === undefined ||
            window.localStorage['bis_token'] === null ||
            window.localStorage['bis_token'] === 'null' ||
            window.localStorage['bis_token'] === 'undefined' ||
            window.localStorage['bis_token'] === '') {
            return '';
        }
        let obj = JSON.parse(window.localStorage['bis_token']);

        return obj;
    }
    public setToken(data: any): void {
        this.setStorageToken(JSON.stringify(data));
     //  this._injector.get(ValidatepermissionService).init();

    }
    public setUserName(name:any):void{
        window.localStorage['name'] = name;
    }
    public getUserName(){
        if (window.localStorage['name'] === undefined ||
            window.localStorage['name'] === null ||
            window.localStorage['name'] === 'null' ||
            window.localStorage['name'] === 'undefined' ||
            window.localStorage['name'] === '') {
            return '';
        }
        return JSON.parse(window.localStorage['name']);
    }
    public failToken(): void {
        this.setStorageToken(undefined);
    }
    public logout(): void {
        this.setStorageToken(undefined);
        this.navigateToLogin(this.router.routerState.snapshot.url);

    }
    private setStorageToken(value: any): void {
        window.localStorage['bis_token'] = value;
        this.authenticationChanged.next(this.isAuthenticated());
    }
    public navigateToLogin(stateUrl) {

     //   this._injector.get(ValidatepermissionService).set();

        this.router.navigate(['/login'], { queryParams: { queryParams: { returnUrl: stateUrl } } });

    }
    public navigateToForbidden() {
        this.router.navigateByUrl('/forbidden');


    }
}
