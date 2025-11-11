import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokensSig = signal<AuthTokens | null>(null);
  private userSig = signal<UserProfile | null>(null);

  get tokens() { return this.tokensSig(); }
  get user() { return this.userSig(); }

  isAuthenticated$(): Observable<boolean> {
    return of(this.tokensSig()).pipe(map(t => !!t && t.expiresAt > Date.now()));
  }

  requestOtp(identifier: string): Observable<void> {
    // Mock API: emulate network delay
    return timer(600).pipe(map(() => void 0));
  }

  verifyOtp(otp: string): Observable<AuthTokens> {
    if (!otp) return throwError(() => new Error('Invalid OTP'));
    return timer(600).pipe(map(() => {
      const tokens: AuthTokens = {
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        expiresAt: Date.now() + 5 * 60 * 1000,
      };
      this.tokensSig.set(tokens);
      this.userSig.set({ id: 'u1', name: 'Skillrat Admin', role: 'admin' });
      return tokens;
    }));
  }

  refreshToken(): Observable<AuthTokens> {
    const t = this.tokensSig();
    if (!t?.refreshToken) return throwError(() => new Error('No refresh token'));
    return timer(400).pipe(map(() => {
      const tokens: AuthTokens = {
        accessToken: 'mock_access_token_refreshed',
        refreshToken: t.refreshToken,
        expiresAt: Date.now() + 5 * 60 * 1000,
      };
      this.tokensSig.set(tokens);
      return tokens;
    }));
  }

  logout(): void {
    this.tokensSig.set(null);
    this.userSig.set(null);
  }
}
