import { createReducer, on } from '@ngrx/store';
import { AuthState } from './auth.models';
import { AuthActions } from './auth.actions';

export const initialState: AuthState = {
  user: null,
  tokens: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { user, tokens }) => ({ ...state, user, tokens })),
  on(AuthActions.logout, () => initialState)
);
