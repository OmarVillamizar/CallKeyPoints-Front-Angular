import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-shell/app-shell').then((m) => m.AppShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'new' },
      {
        path: 'new',
        loadComponent: () => import('./features/new-report/new-report').then((m) => m.NewReport),
      },
      {
        path: 'calls/:id',
        loadComponent: () => import('./features/call-report/call-report').then((m) => m.CallReport),
      },
      {
        path: 'config',
        loadComponent: () => import('./features/config/config').then((m) => m.Config),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
