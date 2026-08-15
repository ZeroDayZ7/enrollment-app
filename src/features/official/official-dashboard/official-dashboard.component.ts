import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

@Component({
  selector: 'app-official-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './official-dashboard.component.html'
})
export class OfficialDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSidebarOpen = signal<boolean>(true);
  readonly currentUser = this.authService.currentUser;

  readonly navItems: NavItem[] = [
    { label: 'Pulpit główny', icon: '📊', route: '/official/dashboard' },
    { label: 'Oczekujące wnioski', icon: '📑', route: '/official/applications', badge: 5 },
    { label: 'Rejestr umów', icon: '📁', route: '/official/contracts' },
    { label: 'Weryfikacja QR', icon: '🔍', route: '/official/verify' },
    { label: 'Dziennik zdarzeń', icon: '📜', route: '/official/audit' }
  ];

  readonly stats: StatCard[] = [
    { title: 'Przetworzone dzisiaj', value: '142', change: '+12%', trend: 'up' },
    { title: 'Wnioski oczekujące', value: '18', change: '-3', trend: 'down' },
    { title: 'Aktywne sesje QR', value: '4', change: '0', trend: 'neutral' },
    { title: 'Czas obsługi (śr.)', value: '2m 15s', change: '-18s', trend: 'up' }
  ];

  toggleSidebar(): void {
    this.isSidebarOpen.update(val => !val);
  }

  logout(): void {
    this.authService.logout();
    this.authService.logout('/official/login');
  }
}