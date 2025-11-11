import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.models';

export const selectAuth = createFeatureSelector<AuthState>('auth');
export const selectUser = createSelector(selectAuth, s => s.user);
export const selectTokens = createSelector(selectAuth, s => s.tokens);
export const selectIsAuthenticated = createSelector(selectTokens, t => !!t && t.expiresAt > Date.now());
