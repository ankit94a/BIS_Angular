import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedLibraryModule } from '../../../../sharedlibrary/src/shared-library.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,SharedLibraryModule,MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginform: FormGroup;
  showPassword = false;
  loginLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router,private apiService:ApiService,private authService:AuthService) {  this.loginform = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });}
  ngOnInit(): void {

  }

  get formControls() {
    return this.loginform.controls;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  proceedlogin() {
    if (this.loginform.invalid) {
      return;
    }

    const loginData = this.loginform.value;

    this.apiService.postWithHeader('auth/login', loginData).subscribe({
      next: (res) => {
        this.loginLoading = false; 
        if (res && res.token && res.user) {
          this.authService.setToken(res.token);
          this.authService.setUserDetails(res.user);

          let redirectUrl = '/dashboard'; 

          if (res.user.roleType == '1') {
            redirectUrl = '/master-data';
          } else if (res.user.roleType == '7') {
            redirectUrl = '/cdr-dahboard';
          }else if(res.user.roleType == '8'){
            redirectUrl = '/attribute'
          }else if(res.user.roleType == '10' || res.user.roleType == '11' || res.user.roleType == '12' || res.user.roleType == '13' || res.user.roleType == '14' || res.user.roleType == '15'){
            redirectUrl = '/corps'
          }

          this.router.navigate([redirectUrl]); 
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.loginLoading = false; 
      }
    });
  }


}
