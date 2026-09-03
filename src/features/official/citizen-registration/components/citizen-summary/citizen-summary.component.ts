import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, input, output } from '@angular/core';
import { Download, LucideAngularModule, ShieldAlert } from 'lucide-angular';
import { environment } from '../../../../../environments/environment';

export interface RegistrationSummary {
  pesel: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pukCode: string;
  agreementNumber: string;
  agreement_download_url: string;
  registeredAt: string;
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
    const url = `${environment.apiUrl}/official${this.summary().agreement_download_url}`;

    // Przygotowanie opcji żądania
    const options = {
      responseType: 'blob' as 'json', // Obejście typowania TS dla blob
      withCredentials: true,           // Wsyłanie ciasteczek sesyjnych
      headers: new HttpHeaders({
        'X-Device-Fingerprint': 'web-client' // Wymagany nagłówek przez Gateway/BFF
      })
    };

    this.http.get(url, options).subscribe({
      next: (data: any) => {
        const blob = new Blob([data], { type: 'application/pdf' });
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