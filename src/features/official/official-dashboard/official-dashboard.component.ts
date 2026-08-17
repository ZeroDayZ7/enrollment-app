import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FileText, LucideAngularModule, QrCode, UserPlus, Vote } from 'lucide-angular';
import { APP_ROUTES } from '../../../core/constants/app-routes';

@Component({
  selector: 'app-official-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './official-dashboard.component.html'
})
export class OfficialDashboardComponent {
  readonly routes = APP_ROUTES;
  readonly icons = { UserPlus, QrCode, Vote, FileText };

  readonly recentLogs = [
    { id: 'REQ-2026-0891', type: 'Weryfikacja Tożsamości QR', op: 'OP-88421', status: 'Zatwierdzono', time: '10 min temu' },
    { id: 'REQ-2026-0890', type: 'Rejestracja Nowego Obywatela', op: 'OP-88421', status: 'Zatwierdzono', time: '25 min temu' },
    { id: 'REQ-2026-0889', type: 'Wydanie Tokenu E-Voting (Blind Signature)', op: 'OP-88421', status: 'W trakcie', time: '1 godz. temu' }
  ];
}