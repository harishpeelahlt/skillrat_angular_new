import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated$().pipe(
    map(isAuthed => {
      if (!isAuthed) {
        router.navigateByUrl('/auth/login');
        return false;
      }
      return true;
    })
  );
};
