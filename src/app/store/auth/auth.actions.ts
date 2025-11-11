import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthState } from './auth.models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Success': props<{ user: NonNullable<AuthState['user']>; tokens: NonNullable<AuthState['tokens']> }>(),
    'Logout': emptyProps(),
  },
});
