import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const credentialsReq = req.clone({
    withCredentials: true
  });

  return next(credentialsReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthRequest =
        req.url.includes(API_ENDPOINTS.OFFICIAL.AUTH.LOGIN) ||
        req.url.includes(API_ENDPOINTS.OFFICIAL.AUTH.REFRESH);

      if (error.status === 401 && !isAuthRequest) {
        return authService.refreshToken().pipe(
          switchMap(() => next(credentialsReq)),
          catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};