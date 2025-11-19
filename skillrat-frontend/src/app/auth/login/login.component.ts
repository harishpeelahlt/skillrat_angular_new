import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthserviceService } from '../authservice/authservice.service';
import { LoginPayload, RegisterPayload } from '../Models/auth.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showRegister = false;

  loginForm: FormGroup;
  registerForm: FormGroup;

  isSubmittingLogin = false;
  isSubmittingRegister = false;
  loginError: string | null = null;
  registerError: string | null = null;
  loginLoading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthserviceService,
    private MatSnackBar : MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleRegister() {
    this.showRegister = !this.showRegister;
    this.loginError = null;
    this.registerError = null;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmittingLogin = true;
    this.loginError = null;
    this.loginLoading = true;

    const payload: LoginPayload = this.loginForm.value;

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.isSubmittingLogin = false;
        this.loginLoading = false;
        this.getUser();
        // TODO: handle token / user data from response
        this.router.navigate(['/layout']);
      },
      error: (error) => {
        this.isSubmittingLogin = false;
        this.loginLoading = false;
        this.loginError = error?.error?.message || 'Login failed. Please try again.';
        this.MatSnackBar.open(this.loginError || 'Login failed. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    });
  }

  getUser() {
    this.loginLoading = true;
      this.authService.getCurrentUser().subscribe({
        next: () => {
          this.loginLoading = false;
          // User is authenticated, ensure they are on a protected route
          if (this.router.url === '/' || this.router.url.startsWith('/auth')) {
            this.router.navigate(['/layout']);
          }
        },
        error: () => {
          this.loginLoading = false;
          this.loginError = 'Login failed. Please try again.';
          this.MatSnackBar.open(this.loginError || 'Login failed. Please try again.', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          // Token invalid or expired
          localStorage.removeItem('access_token');
          this.router.navigate(['/auth/login']);
        }
      });
  }
  registerSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmittingRegister = true;
    this.registerError = null;
    this.loginLoading = true;

    const payload: RegisterPayload = this.registerForm.value;

    this.authService.register(payload).subscribe({
      next: () => {
        this.loginLoading = false;
        this.isSubmittingRegister = false;
        this.showRegister = false;
        this.loginForm.reset();
      },
      error: (error) => {
        this.loginLoading = false;
        this.MatSnackBar.open(error?.error?.message || 'Registration failed. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.isSubmittingRegister = false;
        this.registerError = error?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
