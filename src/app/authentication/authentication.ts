import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginModel } from './Models/LoginModel';
import { RegisterModel } from './Models/RegisterModel';
import { APIAuthenactionService } from '../Services/api.Authentication.Service';

@Component({
  selector: 'app-authentication',
  imports: [FormsModule],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication {
  loginModel: LoginModel;
  registerModel: RegisterModel;

  private apiAuthService: APIAuthenactionService=inject(APIAuthenactionService);
  constructor(){
    this.loginModel = new LoginModel();
    this.registerModel = new RegisterModel();
  }

  login(){
    console.log(this.loginModel);
    this.apiAuthService.apiLogin(this.loginModel).subscribe({
      next:(response:any)=>{
        if(response){
         // localStorage.setItem('token', response?.token);//local Storage
 
          sessionStorage.setItem('token',response?.token)//session storage
 
          alert('Login successful!');
         
        }
      },
      error:(error)=>{
        alert('Login failed: ' + error.message);
      },
      complete:()=>{
        console.log('Login request completed');
      }
    });
  }


    register(){
    console.log(this.registerModel);
    this.apiAuthService.apiRegister(this.registerModel).subscribe({
      next:(response:any)=>{
        if(response){
         // localStorage.setItem('token', response?.token);//local Storage
 
          sessionStorage.setItem('token',response?.token)//session storage
 
          alert('Register successful!');
         
        }
      },
      error:(error)=>{
  console.log(error);
  console.log(error.error);

  alert('Register failed');
},
      complete:()=>{
        console.log('Register request completed');
      }
    });
  }
}
