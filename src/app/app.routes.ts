import { Routes } from '@angular/router';
import { OfficialDashboardComponent } from '../features/official/official-dashboard/official-dashboard.component';
import { OfficialLoginComponent } from '../features/official/official-login/official-login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Panel Urzędnika
  { path: 'login', component: OfficialLoginComponent },
  { path: 'dashboard', component: OfficialDashboardComponent },

  // Fallback
  { path: '**', redirectTo: 'login' }
];