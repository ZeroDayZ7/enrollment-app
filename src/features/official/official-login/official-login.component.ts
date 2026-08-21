import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../../../core/constants/app-routes';
import { AuthService } from '../../../core/services/auth.service';
import { CryptoService, DevCardFile } from '../../../core/services/crypto.service';

@Component({
  selector: 'app-official-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './official-login.component.html'
})
export class OfficialLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cryptoService = inject(CryptoService);
  private readonly router = inject(Router);

  // Stan UI
  readonly step = signal<1 | 2>(1);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  // Dane Kroku 2
  private challenge = signal<string | null>(null);
  private userId = signal<string | null>(null);
  readonly loadedCard = signal<DevCardFile | null>(null);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['urzednik@plus.pl', [Validators.required, Validators.minLength(3)]],
    password: ['Zaq1@wsx', [Validators.required, Validators.minLength(4)]]
  });

  readonly cardForm = this.fb.nonNullable.group({
    pin: ['', [Validators.required, Validators.minLength(4)]]
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  // Krok 1: Wyłapanie danych i konwersja hasła do tablicy bajtów
  onSubmitStep1(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValues = this.loginForm.getRawValue();

    // Konwersja hasła na bytes
    const passwordBytes = new TextEncoder().encode(formValues.password);

    const payload = {
      email: formValues.email,
      password: Array.from(passwordBytes) as unknown as string
    };

    this.authService.loginStep1(payload).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.challenge.set(res.challenge);
        this.userId.set(res.userId);
        this.step.set(2);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Nieprawidłowy identyfikator lub hasło.'
        );
      }
    });
  }

  // Krok 2: Plik karty
  async onCardFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;

    try {
      const card = await this.cryptoService.parseCardFile(input.files[0]);
      this.loadedCard.set(card);
      this.errorMessage.set(null);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Błąd odczytu pliku karty.');
    }
  }

  // Krok 2: Podpis i finalizacja
  async onSubmitStep2(): Promise<void> {
    const card = this.loadedCard();
    const challenge = this.challenge();
    const userId = this.userId();

    if (!card || !challenge || !userId) {
      this.errorMessage.set('Wczytaj plik karty urzędnika.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const signature = await this.cryptoService.signChallenge(challenge, card.privateKey);

      this.authService.loginStep2({
        userId,
        cardSerialNumber: card.cardSerialNumber,
        challenge,
        signature
      }).subscribe({
        next: () => {
          this.clearSensitiveData();
          this.router.navigate([APP_ROUTES.OFFICIAL.DASHBOARD]);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.errorMessage.set(err?.error?.message || 'Weryfikacja podpisu kryptograficznego nie powiodła się.');
        }
      });
    } catch (err) {
      this.isLoading.set(false);
      this.errorMessage.set('Błąd podczas generowania podpisu kryptograficznego.');
    }
  }

  // Powrót do kroku 1
  resetToStep1(): void {
    this.clearSensitiveData();
    this.step.set(1);
    this.errorMessage.set(null);
  }

  private clearSensitiveData(): void {
    this.loadedCard.set(null);
    this.challenge.set(null);
    this.userId.set(null);
    this.cardForm.reset();
    this.loginForm.reset();
  }
}