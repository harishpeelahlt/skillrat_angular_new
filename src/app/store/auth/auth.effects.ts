import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);

  // Placeholder for future async flows
  noop$ = createEffect(() => this.actions$.pipe(ofType(AuthActions.logout)), { dispatch: false });
}
