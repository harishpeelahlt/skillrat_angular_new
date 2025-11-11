import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard = (roles: Array<'admin' | 'teacher' | 'student'>): CanActivateFn => () => {
  const auth = inject(AuthService);
  const user = auth.user;
  return !!user && roles.includes(user.role);
};
