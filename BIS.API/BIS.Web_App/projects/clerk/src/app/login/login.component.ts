import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedLibraryModule } from '../../../../sharedlibrary/src/shared-library.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,SharedLibraryModule,MatProgressSpinnerModule,RouterLink],
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
    // if (this.loginform.invalid) {
    //   return;
    // }

    this.loginLoading = true;
    const loginData = this.loginform.value;

    this.apiService.postWithHeader('auth/login',loginData).subscribe((res)=>{
      if(res){
        debugger
        this.authService.setToken(res.token);
        this.authService.setUserDetails(res.user);
        if(this.authService.getRoleType() == '1'){
          this.router.navigateByUrl('/master-data');
        }else{
          this.router.navigateByUrl('/dashboard');
        }
        
      }else{
        this.router.navigateByUrl('/');
      }
    })
  }

}
