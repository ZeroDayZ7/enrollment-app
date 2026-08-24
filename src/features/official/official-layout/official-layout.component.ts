import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { APP_ROUTES } from '@core/constants/app-routes';
import { AuthService } from '@core/services/auth.service';
import {
  History,
  LayoutDashboard,
  LucideAngularModule,
  LucideIconData,
  Menu,
  QrCode,
  Settings,
  Shield,
  User,
  UserPlus,
  Vote
} from 'lucide-angular';

export interface NavItem {
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

  readonly mainNavItems: NavItem[] = [
    { label: 'Pulpit główny', icon: LayoutDashboard, route: APP_ROUTES.OFFICIAL.DASHBOARD },
    { label: 'Rejestracja obywatela', icon: UserPlus, route: APP_ROUTES.OFFICIAL.CITIZENS.REGISTER },
    { label: 'Weryfikacja QR', icon: QrCode, route: APP_ROUTES.OFFICIAL.VERIFY },
    { label: 'Uprawnienia Voting', icon: Vote, route: APP_ROUTES.OFFICIAL.VOTING_TOKENS },
    { label: 'Dziennik zdarzeń', icon: History, route: APP_ROUTES.OFFICIAL.AUDIT }
  ];

  readonly bottomNavItems: NavItem[] = [
    { label: 'Moje konto', icon: User, route: APP_ROUTES.OFFICIAL.PROFILE },
    { label: 'Ustawienia', icon: Settings, route: APP_ROUTES.OFFICIAL.SETTINGS }
  ];

  toggleSidebar(): void {
    this.isSidebarOpen.update(val => !val);
  }

  logout(): void {
    this.authService.logout(APP_ROUTES.OFFICIAL.LOGIN);
  }
}