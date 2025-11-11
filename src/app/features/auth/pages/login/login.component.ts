import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  form = this.fb.group({
    identifier: ['', [Validators.required]],
  });

  submitting = false;

  submit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    const identifier = this.form.value.identifier as string;
    this.auth.requestOtp(identifier).subscribe(() => {
      this.submitting = false;
      this.router.navigateByUrl('/auth/otp');
    });
  }
}
