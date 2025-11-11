import { createReducer, on } from '@ngrx/store';
import { DashboardState } from './dashboard.models';
import { DashboardActions } from './dashboard.actions';

const initialState: DashboardState = {
  stats: { students: 0, teachers: 0, classes: 0, exams: 0 },
};

export const dashboardReducer = createReducer(
  initialState,
  on(DashboardActions.loaded, (s, { stats }) => ({ ...s, stats }))
);
