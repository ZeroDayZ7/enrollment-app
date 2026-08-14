import { Routes } from '@angular/router';
import { CitizenDashboardComponent } from '../features/citizen/citizen-dashboard/citizen-dashboard.component';
import { CitizenLoginComponent } from '../features/citizen/citizen-login/citizen-login.component';
import { OfficialDashboardComponent } from '../features/official/official-dashboard/official-dashboard.component';
import { OfficialLoginComponent } from '../features/official/official-login/official-login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'citizen/login', pathMatch: 'full' },

  // Strefa Obywatela
  { path: 'citizen/login', component: CitizenLoginComponent },
  { path: 'citizen/dashboard', component: CitizenDashboardComponent },

  // Strefa Urzędnika
  { path: 'official/login', component: OfficialLoginComponent },
  { path: 'official/dashboard', component: OfficialDashboardComponent },

  // Fallback
  { path: '**', redirectTo: 'citizen/login' }
];