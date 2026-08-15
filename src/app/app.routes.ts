import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'official/login', pathMatch: 'full' },
  {
    path: 'official/login',
    loadComponent: () =>
      import('../features/official/official-login/official-login.component').then(
        (m) => m.OfficialLoginComponent
      )
  },
  {
    path: 'official/dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/official/official-dashboard/official-dashboard.component').then(
        (m) => m.OfficialDashboardComponent
      )
  }
];