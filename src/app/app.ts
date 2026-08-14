import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected themeService = inject(ThemeService);
}