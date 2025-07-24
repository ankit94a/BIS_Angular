import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedLibraryModule } from '../../../../sharedlibrary/src/shared-library.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-forgotpassword',
  imports: [ReactiveFormsModule, SharedLibraryModule, MatProgressSpinnerModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.scss'
})
export class ForgotpasswordComponent {
  loginform: FormGroup;
  showPassword = false;
  loginLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {  this.loginform = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
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

    this.loginLoading = true;
    const loginData = this.loginform.value;

    setTimeout(() => {
      this.loginLoading = false;
      if (loginData.confirmPassword === 'password123' && loginData.password === 'password123') {
        this.router.navigate(['/dashboard']);
      } else {
        alert('Invalid credentials');
        this.loginform.reset();
      }
    }, 2000);
  }
}
