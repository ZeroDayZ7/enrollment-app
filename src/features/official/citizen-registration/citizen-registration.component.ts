import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  Image as ImageIcon,
  KeyRound,
  LucideAngularModule,
  Printer,
  ShieldAlert,
  Upload,
  UserPlus
} from 'lucide-angular';

interface RegistrationSummary {
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
  selector: 'app-citizen-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './citizen-registration.component.html'
})
export class CitizenRegistrationComponent {
  private readonly fb = inject(FormBuilder);

  readonly icons = {
    ArrowLeft,
    UserPlus,
    CheckCircle2,
    Upload,
    ImageIcon,
    Printer,
    KeyRound,
    FileCheck,
    ShieldAlert
  };

  readonly isSubmitting = signal(false);
  readonly summaryData = signal<RegistrationSummary | null>(null);
  readonly photoPreview = signal<string | null>(null);

  // Domyślne dane testowe zapobiegające ciągłemu wpisywaniu
  readonly registrationForm = this.fb.nonNullable.group({
    pesel: ['89010112345', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    firstName: ['Jan', [Validators.required, Validators.minLength(2)]],
    lastName: ['Kowalski', [Validators.required, Validators.minLength(2)]],
    email: ['jan.kowalski@example.com', [Validators.required, Validators.email]],
    phone: ['+48600700800', [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)]],
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

    // Symulacja rejestracji i generowania bezpiecznych kodów (PUK / Aktywacja)
    setTimeout(() => {
      const rawForm = this.registrationForm.getRawValue();

      this.summaryData.set({
        pesel: rawForm.pesel,
        firstName: rawForm.firstName,
        lastName: rawForm.lastName,
        email: rawForm.email,
        phone: rawForm.phone,
        pukCode: this.generateRandomCode(8),
        activationCode: this.generateRandomCode(6, true),
        registeredAt: new Date(),
        photoPreviewUrl: this.photoPreview()
      });

      this.isSubmitting.set(false);
    }, 600);
  }

  printContract(): void {
    window.print();
  }

  resetForm(): void {
    this.summaryData.set(null);
    this.photoPreview.set(null);
    this.registrationForm.reset({
      pesel: '89010112345',
      firstName: 'Jan',
      lastName: 'Kowalski',
      email: 'jan.kowalski@example.com',
      phone: '+48600700800',
      acceptTerms: true
    });
  }

  private generateRandomCode(length: number, numericOnly = false): string {
    const chars = numericOnly ? '0123456789' : '346789ABCDEFGHJKLMNPQRTUVWXY';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}