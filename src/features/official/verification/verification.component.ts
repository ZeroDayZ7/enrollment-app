import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { AlertTriangle, CheckCircle2, FileBadge2, LucideAngularModule, QrCode, ShieldCheck } from 'lucide-angular';
import { mockVerificationDocument } from './verification.mock';

type VerificationStatus = 'idle' | 'success' | 'error';

@Component({
  selector: 'app-official-verification',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './verification.component.html'
})
export class VerificationComponent {
  readonly icons = { QrCode, ShieldCheck, CheckCircle2, AlertTriangle, FileBadge2 };
  readonly document = mockVerificationDocument;

  readonly verificationCode = signal('');
  readonly verificationStatus = signal<VerificationStatus>('idle');
  readonly statusMessage = signal('Wprowadź lub wklej kod z dokumentu, aby rozpocząć weryfikację.');
  readonly verificationNote = signal('Weryfikacja została przygotowana w trybie demonstracyjnym.');

  verifyDocument(): void {
    const code = this.verificationCode().trim();

    if (!code) {
      this.verificationStatus.set('error');
      this.statusMessage.set('Pole z kodem jest puste. Wprowadź wartość do weryfikacji.');
      this.verificationNote.set('Wprowadź kod QR lub identyfikator dokumentu, aby kontynuować.');
      return;
    }

    const validCodes = [this.document.qrCode, 'QR-2026-7812', 'VRF-2026-7812'];

    if (validCodes.includes(code)) {
      this.verificationStatus.set('success');
      this.statusMessage.set('Dokument został pomyślnie zweryfikowany.');
      this.verificationNote.set(`Ważność dokumentu potwierdzona przez ${this.document.authority}.`);
      return;
    }

    this.verificationStatus.set('error');
    this.statusMessage.set('Weryfikacja nie powiodła się. Kod nie został rozpoznany lub dokument jest niezgodny.');
    this.verificationNote.set('Sprawdź poprawność wpisanego kodu lub odśwież widok, aby ponowić próbę.');
  }

  resetVerification(): void {
    this.verificationCode.set('');
    this.verificationStatus.set('idle');
    this.statusMessage.set('Wprowadź lub wklej kod z dokumentu, aby rozpocząć weryfikację.');
    this.verificationNote.set('Weryfikacja została przygotowana w trybie demonstracyjnym.');
  }
}
