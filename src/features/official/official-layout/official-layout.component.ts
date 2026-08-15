import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  FileText,
  Folder,
  History,
  LayoutDashboard,
  LucideAngularModule,
  LucideIconData,
  Menu,
  QrCode,
  Shield
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
    { label: 'Oczekujące wnioski', icon: FileText, route: '/official/applications', badge: 5 },
    { label: 'Rejestr umów', icon: Folder, route: '/official/contracts' },
    { label: 'Weryfikacja QR', icon: QrCode, route: '/official/verify' },
    { label: 'Dziennik zdarzeń', icon: History, route: '/official/audit' }
  ];

  toggleSidebar(): void {
    this.isSidebarOpen.update(val => !val);
  }

  logout(): void {
    this.authService.logout('/official/login');
  }
}