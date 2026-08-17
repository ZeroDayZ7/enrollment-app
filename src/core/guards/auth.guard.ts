import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { APP_ROUTES } from '../constants/app-routes';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const checkAccess = (): boolean | UrlTree => {
    if (!authService.isAuthenticated()) {
      return router.createUrlTree([APP_ROUTES.OFFICIAL.LOGIN]);
    }

    const requiredPermissions = route.data?.['permissions'] as string[] | undefined;
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAccess = authService.hasAllPermissions(requiredPermissions);
      if (!hasAccess) {
        return router.createUrlTree([APP_ROUTES.OFFICIAL.DASHBOARD]);
      }
    }

    return true;
  };

  // Jeśli profil jest już w pamięci (np. nawigacja wewnątrz SPA)
  if (authService.currentUser() !== null) {
    return checkAccess();
  }

  // Jeśli użytkownik odświeżył stronę (F5) – pobieramy najpierw profil z /auth/me
  return authService.checkSession().pipe(
    map(() => checkAccess()),
    catchError(() => of(router.createUrlTree([APP_ROUTES.OFFICIAL.LOGIN])))
  );
};