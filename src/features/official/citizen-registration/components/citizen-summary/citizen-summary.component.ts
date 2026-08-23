import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, input, output } from '@angular/core';
import { Download, LucideAngularModule, ShieldAlert } from 'lucide-angular';
import { environment } from '../../../../../environments/environment'; // Dopasuj ścieżkę względną do pliku environments

export interface RegistrationSummary {
  pesel: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pukCode: string;
  agreementNumber: string;
  agreement_download_url: string;
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
  private readonly http = inject(HttpClient);

  summary = input.required<RegistrationSummary>();
  reset = output<void>();

  readonly icons = { ShieldAlert, Download };

  downloadAgreement(): void {
    // Składamy pełny adres URL dopiero tutaj:
    const url = `${environment.apiUrl}/official${this.summary().agreement_download_url}`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = `umowa-${this.summary().agreementNumber}.pdf`;
        downloadLink.click();
        window.URL.revokeObjectURL(downloadLink.href);
      },
      error: (err) => {
        console.error('Błąd podczas pobierania umowy:', err);
      }
    });
  }
}