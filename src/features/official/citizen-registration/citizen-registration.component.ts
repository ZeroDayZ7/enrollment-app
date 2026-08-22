import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';

import { CitizenPayload } from '@core/models/citizen.model';
import { CitizenService } from '@core/services/citizen.service';
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

  readonly icons = { ArrowLeft };

  readonly isSubmitting = signal(false);
  readonly summaryData = signal<RegistrationSummary | null>(null);
  readonly photoPreview = signal<string | null>(null);
  private readonly citizenService = inject(CitizenService);

  readonly registrationForm = this.fb.nonNullable.group({
    pesel: ['89010112345', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    firstName: ['Jan', [Validators.required, Validators.minLength(2)]],
    secondName: [''],
    lastName: ['Kowalski', [Validators.required, Validators.minLength(2)]],
    email: ['jan.kowalski@example.com', [Validators.required, Validators.email]],
    phoneNumber: ['+48600700800', [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)]],
    city: ['Warszawa', [Validators.required]],
    street: ['Marszałkowska', [Validators.required]],
    houseNumber: ['10', [Validators.required]],
    flatNumber: ['5'],
    postalCode: ['00-001', [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]],
    acceptTerms: [true, [Validators.requiredTrue]]
  });

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
      next: (res) => {
        this.summaryData.set({
          pesel: rawForm.pesel,
          firstName: rawForm.firstName,
          lastName: rawForm.lastName,
          email: rawForm.email,
          phone: rawForm.phoneNumber,
          pukCode: res.pukCode,
          activationCode: res.activationCode,
          registeredAt: new Date(res.registeredAt),
          photoPreviewUrl: this.photoPreview()
        });
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Błąd rejestracji obywatela:', err);
        this.isSubmitting.set(false);
      }
    });
  }

  resetForm(): void {
    this.summaryData.set(null);
    this.photoPreview.set(null);
    this.registrationForm.reset({
      pesel: '89010112345',
      firstName: 'Jan',
      secondName: '',
      lastName: 'Kowalski',
      email: 'jan.kowalski@example.com',
      phoneNumber: '+48600700800',
      city: 'Warszawa',
      street: 'Marszałkowska',
      houseNumber: '10',
      flatNumber: '5',
      postalCode: '00-001',
      acceptTerms: true
    });
  }
}