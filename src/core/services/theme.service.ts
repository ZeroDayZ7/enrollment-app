import { DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);

  isDarkMode = signal<boolean>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  constructor() {
    effect(() => {
      const isDark = this.isDarkMode();
      if (isDark) {
        this.document.documentElement.classList.add('dark-mode');
      } else {
        this.document.documentElement.classList.remove('dark-mode');
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((prev) => !prev);
  }
}