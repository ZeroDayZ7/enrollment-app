// core/interceptors/error.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 0:
          console.error('[ErrorInterceptor] Brak połączenia z siecią lub CORS.');
          break;
        case 401:
          // Nie przekierowuj tutaj! Pozwól authInterceptorowi obsłużyć refresh / logout,
          // a komponentom logowania obsłużyć błędne hasło.
          break;
        case 403:
          console.warn('[ErrorInterceptor] Brak uprawnień do zasobu (403).');
          break;
        case 404:
          console.warn(`[ErrorInterceptor] Zasób nie istnieje (404): ${req.url}`);
          break;
        default:
          if (error.status >= 500) {
            console.error(`[ErrorInterceptor] Błąd serwera (${error.status}):`, error.message);
          }
          break;
      }

      return throwError(() => error);
    })
  );
};