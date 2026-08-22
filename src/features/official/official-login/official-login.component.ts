import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../../../core/constants/app-routes';
import { LoginStep2Request } from '../../../core/models/auth.model';
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

  readonly step = signal<1 | 2>(1);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  private challenge = signal<string | null>(null);
  private userId = signal<string | null>(null);
  readonly loadedCard = signal<DevCardFile | null>(null);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['officer@plus.pl', [Validators.required, Validators.minLength(3)]],
    password: ['Zaq1@wsx', [Validators.required, Validators.minLength(4)]]
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  onSubmitStep1(): void {
    console.group('🚀 [Login Component] Submit Krok 1');
    if (this.loginForm.invalid) {
      console.warn('⚠️ Formularz niepoprawny');
      this.loginForm.markAllAsTouched();
      console.groupEnd();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValues = this.loginForm.getRawValue();
    const passwordBytes = new TextEncoder().encode(formValues.password);

    const payload = {
      email: formValues.email,
      password: Array.from(passwordBytes) as unknown as string
    };

    console.log('📤 Wysłanie żądania Step 1 z payloadem:', payload);

    this.authService.loginStep1(payload).subscribe({
      next: (res) => {
        console.log('📥 Odpowiedź z Step 1 (Backend):', res);
        this.isLoading.set(false);
        this.challenge.set(res.challenge);
        console.log('🔑 Ustawiono challenge w sygnale:', res.challenge);
        this.step.set(2);
        console.log('🔄 Zmieniono krok na 2');
        console.groupEnd();
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Błąd w Krok 1:', err);
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Nieprawidłowy identyfikator lub hasło.'
        );
        console.groupEnd();
      }
    });
  }

  async onCardFileSelected(event: Event): Promise<void> {
    console.group('📁 [Login Component] Wybór pliku karty');
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) {
      console.warn('⚠️ Nie wybrano żadnego pliku.');
      console.groupEnd();
      return;
    }

    try {
      const card = await this.cryptoService.parseCardFile(input.files[0]);
      this.loadedCard.set(card);

      // Zapisujemy userId z karty bezpośrednio w stanie komponentu
      if (card?.userId) {
        this.userId.set(card.userId);
      }

      this.errorMessage.set(null);
      console.log('✅ Karta załadowana do stanu komponentu:', card);
    } catch (err: any) {
      console.error('❌ Błąd parsowania pliku karty:', err);
      this.errorMessage.set(err.message || 'Błąd odczytu pliku karty.');
    }
    console.groupEnd();
  }

  async onSubmitStep2(): Promise<void> {
    console.group('🚀 [Login Component] Submit Krok 2');
    const card = this.loadedCard();
    const challenge = this.challenge();

    // Zabezpieczenie: Pobierz userId z sygnału lub bezpośrednio z obiektu karty
    const currentUserId = this.userId() || card?.userId;

    console.log('Stan przed wysłaniem Step 2:', {
      cardLoaded: !!card,
      challenge,
      userId: currentUserId,
      cardSerialNumber: card?.cardSerialNumber
    });

    if (!card || !challenge || !currentUserId) {
      console.warn('⚠️ Brak wymaganych danych do Step 2:', {
        cardLoaded: !!card,
        challenge: !!challenge,
        userId: !!currentUserId
      });
      this.errorMessage.set('Wczytaj plik karty urzędnika.');
      console.groupEnd();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const signature = await this.cryptoService.signChallenge(challenge, card.privateKey);

      const payload: LoginStep2Request = {
        user_id: currentUserId,
        card_serial_number: card.cardSerialNumber,
        challenge: challenge,
        signature: signature
      };

      console.log('📤 Wysłanie payloadu do Step 2:', payload);

      this.authService.loginStep2(payload).subscribe({
        next: (userProfile) => {
          console.log('✅ Zalogowano pomyślnie. Zwrócony profil:', userProfile);
          this.clearSensitiveData();
          console.log('🔀 Przekierowywanie do:', APP_ROUTES.OFFICIAL.DASHBOARD);
          this.router.navigate([APP_ROUTES.OFFICIAL.DASHBOARD]);
          console.groupEnd();
        },
        error: (err: HttpErrorResponse) => {
          console.error('❌ Błąd odpowiedzi z backendu w Step 2:', err);
          this.isLoading.set(false);
          this.errorMessage.set(err?.error?.message || 'Weryfikacja podpisu kryptograficznego nie powiodła się.');
          console.groupEnd();
        }
      });
    } catch (err) {
      console.error('❌ Wyjątek podczas generowania podpisu:', err);
      this.isLoading.set(false);
      this.errorMessage.set('Błąd podczas generowania podpisu kryptograficznego.');
      console.groupEnd();
    }
  }

  resetToStep1(): void {
    console.log('🔄 Reset do Kroku 1');
    this.clearSensitiveData();
    this.step.set(1);
    this.errorMessage.set(null);
  }

  private clearSensitiveData(): void {
    console.log('🧹 Czyszczenie wrażliwych danych ze stanu');
    this.loadedCard.set(null);
    this.challenge.set(null);
    this.userId.set(null);
    this.loginForm.reset();
  }
}