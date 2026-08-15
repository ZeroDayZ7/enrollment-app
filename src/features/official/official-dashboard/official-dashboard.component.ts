import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-official-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './official-dashboard.component.html',
  // styleUrl: './official-dashboard.component.scss'
})
export class OfficialDashboardComponent {
  readonly authService = inject(AuthService);

  onLogout(): void {
    this.authService.logout();
  }
}