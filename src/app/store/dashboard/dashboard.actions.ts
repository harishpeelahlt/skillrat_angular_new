import { createActionGroup, emptyProps } from '@ngrx/store';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    'Load': emptyProps(),
    'Loaded': (stats: { students: number; teachers: number; classes: number; exams: number }) => ({ stats }),
  },
});
