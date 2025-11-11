import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const tokens = auth.tokens;
  const authReq = tokens?.accessToken ? req.clone({
    setHeaders: { Authorization: `Bearer ${tokens.accessToken}` }
  }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return auth.refreshToken().pipe(
          switchMap(t => {
            const retry = req.clone({ setHeaders: { Authorization: `Bearer ${t.accessToken}` } });
            return next(retry);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
