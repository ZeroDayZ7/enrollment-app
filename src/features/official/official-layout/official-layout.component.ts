import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  History,
  LayoutDashboard,
  LucideAngularModule,
  LucideIconData,
  Menu,
  QrCode,
  Shield,
  UserPlus,
  Vote
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: LucideIconData | any;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-official-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    LucideAngularModule
  ],
  templateUrl: './official-layout.component.html'
})
export class OfficialLayoutComponent {
  private readonly authService = inject(AuthService);

  readonly isSidebarOpen = signal<boolean>(true);
  readonly currentUser = this.authService.currentUser;
  readonly icons = { Shield, Menu };

  readonly navItems: NavItem[] = [
    { label: 'Pulpit główny', icon: LayoutDashboard, route: '/official/dashboard' },
    { label: 'Rejestracja obywatela', icon: UserPlus, route: '/official/citizens/register' },
    { label: 'Weryfikacja QR', icon: QrCode, route: '/official/verify' },
    { label: 'Uprawnienia Voting', icon: Vote, route: '/official/voting-tokens' },
    { label: 'Dziennik zdarzeń', icon: History, route: '/official/audit' }
  ];

  toggleSidebar(): void {
    this.isSidebarOpen.update(val => !val);
  }

  logout(): void {
    this.authService.logout('/official/login');
  }
}