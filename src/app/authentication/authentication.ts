import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginModel } from './Models/LoginModel';
import { RegisterModel } from './Models/RegisterModel';
import { APIAuthenactionService } from '../Services/api.Authentication.Service';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authentication',
  imports: [FormsModule, CommonModule],
  templateUrl: './authentication.html',
  styleUrls: ['./authentication.css'],
})
export class Authentication {

  loginModel: LoginModel;
  registerModel: RegisterModel;

  activeTab: string = 'login';

  loginError: string = '';
  registerError: string = '';

  isLoginLoading: boolean = false;
  isRegisterLoading: boolean = false;

  private apiAuthService: APIAuthenactionService = inject(APIAuthenactionService);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef); // to refresh UI Manually
  private router = inject(Router);

  constructor(){
    this.loginModel = new LoginModel();
    this.registerModel = new RegisterModel();
  }

  login(){
    this.loginError = '';
    this.isLoginLoading = true;

    this.apiAuthService.apiLogin(this.loginModel)
    .pipe(    // finalize() runs after the observable completes or errors.
      finalize(() => {
        this.isLoginLoading = false;
        this.cd.detectChanges();
      })
    )
    .subscribe({
      next:(response:any)=>{
        if(response){
          sessionStorage.setItem('token',response?.token);
          alert('Login Successful');
          this.router.navigateByUrl('/dashboard');

        }
      },
      error:(error)=>{
        if(error.status === 401){
          this.loginError = 'Invalid username or password';
        }
        else{
          this.loginError = 'Something went wrong. Please try again.';
        }
      }
    });
  }

  // register(){
  //   this.registerError = '';
  //   this.isRegisterLoading = true;

  //   this.apiAuthService.apiRegister(this.registerModel)
  //   .pipe(
  //     finalize(() => {
  //       this.isRegisterLoading = false;
  //       this.cd.detectChanges();
  //     })
  //   )
  //   .subscribe({
  //     next:(response:any)=>{
  //       if(response){
  //         sessionStorage.setItem('token',response?.token);
  //         alert('Register successful!');
  //         this.router.navigateByUrl('')
  //       }
  //     },
  //     error:(error)=>{
  //       if(error.status === 400){
  //         this.registerError = error.error?.message || 'Registration failed';
  //       }
  //       else{
  //         this.registerError = 'Something went wrong.';
  //       }
  //     }
  //   });
  // }

  register(){
  this.registerError = '';
  this.loginError = '';
  this.isRegisterLoading = true;

  this.apiAuthService.apiRegister(this.registerModel)
  .pipe(
    finalize(() => {
      this.isRegisterLoading = false;
      this.cd.detectChanges();
    })
  )
  .subscribe({
    next:(response:any)=>{
      if(response){
        // Switch to login tab
        this.activeTab = 'login';

        // Optional: prefill username in login
        this.loginModel.username = this.registerModel.username;

        // Clear register form
        this.registerModel = new RegisterModel();

        // Show success message in login tab
        this.loginError = 'Registration successful! Please login.';
      }
    },
    error:(error)=>{
      if(error.status === 400){
        this.registerError = error.error?.message || 'Registration failed';
      }
      else{
        this.registerError = 'Something went wrong.';
      }
    }
  });
}
}