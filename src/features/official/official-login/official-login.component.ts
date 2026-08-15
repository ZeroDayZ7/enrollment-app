import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-official-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './official-login.component.html'
})
export class OfficialLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPin = signal(false);

  readonly loginForm = this.fb.nonNullable.group({
    username: ['operator', [Validators.required, Validators.minLength(3)]],
    pin: ['1234', [Validators.required, Validators.minLength(4)]]
  });

  togglePinVisibility(): void {
    this.showPin.update((visible) => !visible);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/official/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Błąd uwierzytelnienia. Sprawdź identyfikator oraz PIN.'
        );
      }
    });
  }
}