import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../../store/auth/auth.actions';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);
  private store = inject(Store);

  form = this.fb.group({ otp: ['', [Validators.required, Validators.minLength(4)]] });
  submitting = false;

  submit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    const otp = this.form.value.otp as string;
    this.auth.verifyOtp(otp).subscribe({
      next: () => {
        const user = this.auth.user!;
        const tokens = this.auth.tokens!;
        if (user && tokens) {
          this.store.dispatch(AuthActions.loginSuccess({ user, tokens }));
        }
        this.submitting = false;
        this.router.navigateByUrl('/');
      },
      error: () => { this.submitting = false; }
    });
  }
}
