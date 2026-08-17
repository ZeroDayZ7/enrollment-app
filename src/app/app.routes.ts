import { Component, inject } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

@Component({
  standalone: true,
  template: `
    <div class="bg-app-surface border border-app-border rounded-xl p-6 transition-colors duration-200">
      <h2 class="text-lg font-semibold text-app-text-main mb-2">{{ title }}</h2>
      <p class="text-sm text-app-text-muted">Moduł jest w trakcie budowy.</p>
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
    title: 'Logowanie — Panel Urzędnika',
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
        title: 'Pulpit — Panel Urzędnika',
        loadComponent: () =>
          import('../features/official/official-dashboard/official-dashboard.component').then(
            (m) => m.OfficialDashboardComponent
          )
      },
      {
        path: 'profile',
        title: 'Moje Konto — Panel Urzędnika',
        loadComponent: () =>
          import('../features/official/official-profile/official-profile.component').then(
            (m) => m.OfficialProfileComponent
          )
      },
      {
        path: 'settings',
        title: 'Ustawienia — Panel Urzędnika',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../features/official/official-settings/official-settings.component').then(
            (m) => m.OfficialSettingsComponent
          )
      },
      {
        path: 'citizens/register',
        title: 'Rejestracja Obywatela — Panel Urzędnika',
        canActivate: [authGuard],
        data: { permissions: ['users.write'] },
        loadComponent: () =>
          import('../features/official/citizen-registration/citizen-registration.component').then(
            (m) => m.CitizenRegistrationComponent
          )
      },
      {
        path: 'verify',
        component: PlaceholderComponent,
        canActivate: [authGuard],
        data: {
          title: 'Weryfikacja QR',
          permissions: ['users.read']
        }
      },
      {
        path: 'voting-tokens',
        component: PlaceholderComponent,
        canActivate: [authGuard],
        data: {
          title: 'Uprawnienia e-Voting',
          permissions: ['messages.write']
        }
      },
      {
        path: 'audit',
        component: PlaceholderComponent,
        canActivate: [authGuard],
        data: {
          title: 'Dziennik zdarzeń',
          permissions: ['reports.view']
        }
      }
    ]
  },
  { path: '**', redirectTo: 'official/dashboard' }
];