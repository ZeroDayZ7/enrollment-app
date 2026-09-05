import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { generateMockCitizenData } from '@core/utils/mock-data-generator';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';

import { CitizenPayload } from '@core/models/citizen.model';
import { CitizenService } from '@core/services/citizen.service';
import { AppModalComponent } from '../../../components/app-modal/app-modal.component';
import { CitizenFormComponent } from './components/citizen-form/citizen-form.component';
import { CitizenSummaryComponent, RegistrationSummary } from './components/citizen-summary/citizen-summary.component';

@Component({
  selector: 'app-citizen-registration',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    CitizenFormComponent,
    CitizenSummaryComponent
  ],
  templateUrl: './citizen-registration.component.html'
})
export class CitizenRegistrationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly citizenService = inject(CitizenService);

  readonly icons = { ArrowLeft };

  readonly isSubmitting = signal(false);
  readonly summaryData = signal<RegistrationSummary | null>(null);
  readonly photoPreview = signal<string | null>(null);

  readonly registrationForm: FormGroup = this.fb.group({
    pesel: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    firstName: ['', [Validators.required]],
    secondName: [''],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required]],
    city: ['', [Validators.required]],
    street: ['', [Validators.required]],
    houseNumber: ['', [Validators.required]],
    flatNumber: [''],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]],
    acceptTerms: [false, [Validators.requiredTrue]]
  });

  fillWithMockData(): void {
    const mock = generateMockCitizenData();

    this.registrationForm.patchValue({
      pesel: mock.pesel,
      firstName: mock.firstName,
      secondName: mock.secondName,
      lastName: mock.lastName,
      email: mock.email,
      phoneNumber: mock.phoneNumber,
      city: mock.city,
      street: mock.street,
      houseNumber: mock.houseNumber,
      flatNumber: mock.flatNumber,
      postalCode: mock.postalCode,
      acceptTerms: true
    });

    this.photoPreview.set(mock.photoUrl);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const rawForm = this.registrationForm.getRawValue();

    const payload: CitizenPayload = {
      firstName: rawForm.firstName,
      secondName: rawForm.secondName ? rawForm.secondName : null,
      lastName: rawForm.lastName,
      pesel: rawForm.pesel,
      email: rawForm.email,
      phoneNumber: rawForm.phoneNumber,
      city: rawForm.city,
      street: rawForm.street,
      houseNumber: rawForm.houseNumber,
      flatNumber: rawForm.flatNumber ? rawForm.flatNumber : null,
      postalCode: rawForm.postalCode
    };

    this.citizenService.registerCitizen(payload).subscribe({
      next: (res: any) => {
        this.summaryData.set({
          pesel: rawForm.pesel,
          firstName: rawForm.firstName,
          lastName: rawForm.lastName,
          email: rawForm.email,
          phone: rawForm.phoneNumber,
          pukCode: res.puk_code,
          agreementNumber: res.agreement_number,
          agreement_download_url: res.agreement_download_url,
          registeredAt: res.created_at,
          photoPreviewUrl: this.photoPreview()
        });
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Błąd rejestracji obywatela:', err);
        this.isSubmitting.set(false);

        const errorMessage = err?.error?.message || 'Wystąpił nieoczekiwany błąd podczas komunikacji z systemem centralnym.';
        const errorCode = err?.error?.code ? `[Kod: ${err.error.code}]` : '';

        this.dialog.open(AppModalComponent, {
          width: '450px',
          data: {
            title: `Błąd rejestracji ${errorCode}`,
            message: errorMessage,
            confirmText: 'Zamknij',
            cancelText: 'Wróć do edycji',
            isDestructive: true
          }
        });
      }
    });
  }

  resetForm(): void {
    this.summaryData.set(null);
    this.photoPreview.set(null);
    this.registrationForm.reset();
  }
}