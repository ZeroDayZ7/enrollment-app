import { CommonModule, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { LucideAngularModule, ShieldAlert } from 'lucide-angular';

export interface RegistrationSummary {
  pesel: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pukCode: string;
  activationCode: string;
  registeredAt: Date;
  photoPreviewUrl: string | null;
}

@Component({
  selector: 'app-citizen-summary',
  standalone: true,
  imports: [CommonModule, DatePipe, LucideAngularModule],
  templateUrl: './citizen-summary.component.html'
})
export class CitizenSummaryComponent {
  summary = input.required<RegistrationSummary>();
  reset = output<void>();

  readonly icons = { ShieldAlert };
}