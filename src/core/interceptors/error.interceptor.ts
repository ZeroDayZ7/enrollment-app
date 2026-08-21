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
          console.error('[ErrorInterceptor] Brak połączenia z siecią lub serwer nie odpowiada (CORS / Offline).');
          break;
        case 401:
          console.warn('[ErrorInterceptor] Sesja wygasła (401). Przekierowanie do logowania.');
          router.navigate(['/auth/login']);
          break;
        case 403:
          console.warn('[ErrorInterceptor] Brak uprawnień do zasobu (403).');
          break;
        case 404:
          console.warn(`[ErrorInterceptor] Zasób nie istnieje (404): ${req.url}`);
          break;
        default:
          if (error.status >= 500) {
            console.error(`[ErrorInterceptor] Krytyczny błąd serwera (${error.status}):`, error.message);
          }
          break;
      }

      return throwError(() => error);
    })
  );
};