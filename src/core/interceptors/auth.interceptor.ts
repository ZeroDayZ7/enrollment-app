import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // 1. Zawsze dołączamy ciasteczka (withCredentials)
  const credentialsReq = req.clone({
    withCredentials: true
  });

  return next(credentialsReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

      // 2. W przypadku 401 próbujemy cicho odświeżyć token przez BFF
      if (error.status === 401 && !isAuthRequest) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Ponawiamy oryginalne zapytanie z nowym ciasteczkiem access_token
            return next(credentialsReq);
          }),
          catchError((refreshError) => {
            // Jeśli refresh_token też wygasł, wylogowujemy użytkownika
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};