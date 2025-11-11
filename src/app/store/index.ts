import { ActionReducerMap } from '@ngrx/store';
import { authReducer } from './auth/auth.reducer';
import { dashboardReducer } from './dashboard/dashboard.reducer';
import { AuthState } from './auth/auth.models';
import { DashboardState } from './dashboard/dashboard.models';
import { AuthEffects } from './auth/auth.effects';
import { DashboardEffects } from './dashboard/dashboard.effects';

export interface RootState {
  auth: AuthState;
  dashboard: DashboardState;
}

export const reducers: ActionReducerMap<RootState> = {
  auth: authReducer,
  dashboard: dashboardReducer,
};

export const effects = [AuthEffects, DashboardEffects];
