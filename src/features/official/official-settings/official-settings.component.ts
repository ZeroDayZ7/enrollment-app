// src/app/features/official/official-settings/official-settings.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  LucideAngularModule,
  Moon,
  Palette,
  Settings,
  Sun
} from 'lucide-angular';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-official-settings',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './official-settings.component.html'
})
export class OfficialSettingsComponent {
  readonly themeService = inject(ThemeService);

  readonly icons = {
    Settings,
    Palette,
    Moon,
    Sun
  };
}