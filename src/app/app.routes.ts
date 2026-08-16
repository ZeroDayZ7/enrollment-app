import { Component, inject } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

@Component({
  standalone: true,
  template: `
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 class="text-lg font-semibold text-slate-100 mb-2">{{ title }}</h2>
      <p class="text-sm text-slate-400">Moduł jest w trakcie budowy.</p>
    </div>
  `
})
export class PlaceholderComponent {
  readonly title = inject(ActivatedRoute).snapshot.data['title'] ?? 'Podstrona';
}

export const routes: Routes = [
  { path: '', redirectTo: 'official/dashboard', pathMatch: 'full' },
  {
    path: 'official/login',
    loadComponent: () =>
      import('../features/official/official-login/official-login.component').then(
        (m) => m.OfficialLoginComponent
      )
  },
  {
    path: 'official',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/official/official-layout/official-layout.component').then(
        (m) => m.OfficialLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../features/official/official-dashboard/official-dashboard.component').then(
            (m) => m.OfficialDashboardComponent
          )
      },
      {
        path: 'citizens/register',
        loadComponent: () =>
          import('../features/official/citizen-registration/citizen-registration.component').then(
            (m) => m.CitizenRegistrationComponent
          )
      },
      {
        path: 'verify',
        component: PlaceholderComponent,
        data: { title: 'Weryfikacja QR' }
      },
      {
        path: 'voting-tokens',
        component: PlaceholderComponent,
        data: { title: 'Uprawnienia e-Voting' }
      },
      {
        path: 'audit',
        component: PlaceholderComponent,
        data: { title: 'Dziennik zdarzeń' }
      }
    ]
  },
  { path: '**', redirectTo: 'official/dashboard' }
];