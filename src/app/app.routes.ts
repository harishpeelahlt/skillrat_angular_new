import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'auth/otp',
    loadComponent: () => import('./features/auth/pages/otp/otp.component').then(m => m.OtpComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/pages/details/details.component').then(m => m.DetailsComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
