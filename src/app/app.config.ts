import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { apiPrefixInterceptor } from '../core/interceptors/api-prefix.interceptor';
import { authInterceptor } from '../core/interceptors/auth.interceptor';
import { deviceFingerprintInterceptor } from '../core/interceptors/device-fingerprint.interceptor';
import { errorInterceptor } from '../core/interceptors/error.interceptor';
import { timeoutInterceptor } from '../core/interceptors/timeout.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([
        apiPrefixInterceptor,         // 1. Modyfikuje URL (dodaje baze)
        deviceFingerprintInterceptor, // 2. Nagłówki urządzania
        authInterceptor,              // 3. Dodaje tokeny JWT / nagłówki Auth
        timeoutInterceptor,          // 4. Pilnuje czasu trwania żądania
        errorInterceptor             // 5. Łapie i obsługuje błędy zwrotne
      ])
    )
  ]
};