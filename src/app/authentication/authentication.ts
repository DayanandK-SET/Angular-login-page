import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { LoginModel } from './Models/LoginModel';
import { RegisterModel } from './Models/RegisterModel';
import { APIAuthenactionService } from '../Services/api.Authentication.Service';
import { TokenService } from '../Services/token.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './authentication.html',
  styleUrls: ['./authentication.css'],
})
export class Authentication {

  loginModel = new LoginModel();
  registerModel = new RegisterModel();

  activeTab = signal<'login' | 'register'>('login');

  loginError = signal('');
  registerError = signal('');

  isLoginLoading = signal(false);
  isRegisterLoading = signal(false);

  // Toast
  toastMessage = signal('');
  toastVisible = signal(false);
  toastType = signal<'success' | 'error'>('success');

  // ─────────────────────
  // Services
  // ─────────────────────
  private apiAuthService = inject(APIAuthenactionService);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  constructor() {
    const token = this.tokenService.getToken();
    if (token) {
      const role = this.tokenService.getRole();
      this.router.navigate(
        [role === 'Admin' ? '/admin' : '/dashboard'],
        { replaceUrl: true }
      );
    }
  }

  // ─────────────────────
  // Toast Helper
  // ─────────────────────
  private showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.toastVisible.set(true);

    setTimeout(() => this.toastVisible.set(false), 2500);
  }

  // ─────────────────────
  // Login
  // ─────────────────────
  login() {
    this.loginError.set('');
    this.isLoginLoading.set(true);

    this.apiAuthService.apiLogin(this.loginModel).subscribe({
      next: (response: any) => {
        this.isLoginLoading.set(false);

        if (response) {
          sessionStorage.setItem('token', response.token);
          this.showToast('Login successful! Redirecting...');

          setTimeout(() => {
            const role = this.tokenService.getRole();
            this.router.navigate(
              [role === 'Admin' ? '/admin' : '/dashboard'],
              { replaceUrl: true }
            );
          }, 1000);
        }
      },
      error: (error) => {
        this.isLoginLoading.set(false);

        this.loginError.set(
          error.status === 401
            ? 'Invalid username or password'
            : 'Something went wrong. Please try again.'
        );
      }
    });
  }

  // ─────────────────────
  // Register
  // ─────────────────────
  register() {
    this.registerError.set('');
    this.isRegisterLoading.set(true);

    this.apiAuthService.apiRegister(this.registerModel).subscribe({
      next: () => {
        this.isRegisterLoading.set(false);

        this.showToast('Registration successful! Please log in.');
        this.registerModel = new RegisterModel();
        this.activeTab.set('login');
      },
      error: (error) => {
        this.isRegisterLoading.set(false);

        this.registerError.set(
          error.status === 400
            ? error.error?.message || 'Registration failed'
            : 'Something went wrong.'
        );
      }
    });
  }
}