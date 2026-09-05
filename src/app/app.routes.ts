import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

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
        canActivate: [authGuard],
        data: {
          title: 'Weryfikacja QR',
          permissions: ['users.read']
        },
        loadComponent: () =>
          import('../features/official/verification/verification.component').then(
            (m) => m.VerificationComponent
          )
      },
      {
        path: 'voting-tokens',
        canActivate: [authGuard],
        data: {
          title: 'Uprawnienia e-Voting',
          permissions: ['messages.write']
        },
        loadComponent: () =>
          import('../features/official/voting-tokens/voting-tokens.component').then(
            (m) => m.VotingTokensComponent
          )
      },
      {
        path: 'audit',
        canActivate: [authGuard],
        data: {
          title: 'Dziennik zdarzeń',
          permissions: ['reports.view']
        },
        loadComponent: () =>
          import('../features/official/audit/audit.component').then(
            (m) => m.AuditComponent
          )
      }
    ]
  },
  { path: '**', redirectTo: 'official/dashboard' }
];