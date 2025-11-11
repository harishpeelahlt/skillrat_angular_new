import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'internships' },
      { path: 'internships', loadComponent: () => import('./internships/internships.component').then(m => m.InternshipsComponent) },
      { path: 'jobs', loadComponent: () => import('./jobs/jobs.component').then(m => m.JobsComponent) },
      { path: 'contests', loadComponent: () => import('./contests/contests.component').then(m => m.ContestsComponent) },
      { path: 'logout', loadComponent: () => import('./logout/logout.component').then(m => m.LogoutComponent) },
    ],
  },
];
