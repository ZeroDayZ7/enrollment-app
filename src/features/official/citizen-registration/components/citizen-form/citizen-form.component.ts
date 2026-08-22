import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ImageIcon, LucideAngularModule, Upload, UserPlus } from 'lucide-angular';

@Component({
  selector: 'app-citizen-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './citizen-form.component.html'
})
export class CitizenFormComponent {
  form = input.required<FormGroup>();
  photoPreview = input<string | null>(null);
  isSubmitting = input<boolean>(false);

  submit = output<void>();
  fileSelected = output<Event>();

  readonly icons = { UserPlus, ImageIcon, Upload };
}