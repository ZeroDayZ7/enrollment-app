import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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
  readonly stats: StatCard[] = [
    { title: 'Przetworzone dzisiaj', value: '142', change: '+12%', trend: 'up' },
    { title: 'Wnioski oczekujące', value: '18', change: '-3', trend: 'down' },
    { title: 'Aktywne sesje QR', value: '4', change: '0', trend: 'neutral' },
    { title: 'Czas obsługi (śr.)', value: '2m 15s', change: '-18s', trend: 'up' }
  ];
}