import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.models';
import { createSelectorFactory, defaultMemoize } from '@ngrx/store';

export const selectDashboard = createFeatureSelector<DashboardState>('dashboard');
export const selectStats = createSelector(selectDashboard, s => s.stats);
export const selectWelcomeName = createSelectorFactory(projector => defaultMemoize(projector))(
  (state: any) => state?.auth?.user?.name ?? 'Guest'
);
