import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, shareReplay, switchMap, tap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { APP_ROUTES } from '../constants/app-routes';
import { LoginRequest, LoginStep1Response, LoginStep2Request, UserProfile } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly currentUser = signal<UserProfile | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly permissions = computed(() => this.currentUser()?.permissions ?? []);
  readonly role = computed(() => this.currentUser()?.role ?? null);

  // Przechowywanie tymczasowego setupToken w pamięci RAM
  private readonly setupToken = signal<string | null>(null);

  private isRefreshing = false;
  private refreshTokenSubject$: Observable<void> | null = null;

  checkSession(): Observable<UserProfile | null> {
    return this.http.get<UserProfile>(API_ENDPOINTS.OFFICIAL.AUTH.ME).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  // Krok 1: Weryfikacja Loginu + Hasła -> Przechwycenie setup_token i challenge
  loginStep1(credentials: LoginRequest): Observable<LoginStep1Response> {
    return this.http.post<LoginStep1Response>(API_ENDPOINTS.OFFICIAL.AUTH.LOGIN, credentials).pipe(
      tap((response) => {
        if (response?.setup_token) {
          this.setupToken.set(response.setup_token);
        }
      })
    );
  }

  // Krok 2: Przekazanie setup_token w Bearer i weryfikacja podpisu
  loginStep2(payload: LoginStep2Request): Observable<UserProfile | null> {
    const token = this.setupToken();

    // Jeśli mamy token w RAM, budujemy nagłówek Authorization
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http
      .post<{ success: boolean }>(API_ENDPOINTS.OFFICIAL.AUTH.LOGIN_STEP2, payload, { headers })
      .pipe(
        tap(() => this.clearSetupToken()), // Czyszczenie tokenu po użyciu
        switchMap(() => this.checkSession())
      );
  }

  clearSetupToken(): void {
    this.setupToken.set(null);
  }

  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  hasAnyPermission(requiredPermissions: string[]): boolean {
    const userPerms = this.permissions();
    return requiredPermissions.some((perm) => userPerms.includes(perm));
  }

  hasAllPermissions(requiredPermissions: string[]): boolean {
    const userPerms = this.permissions();
    return requiredPermissions.every((perm) => userPerms.includes(perm));
  }

  hasRole(requiredRole: string): boolean {
    return this.role() === requiredRole;
  }

  refreshToken(): Observable<void> {
    if (this.isRefreshing && this.refreshTokenSubject$) {
      return this.refreshTokenSubject$;
    }

    this.isRefreshing = true;

    this.refreshTokenSubject$ = this.http.post<void>(API_ENDPOINTS.OFFICIAL.AUTH.REFRESH, {}).pipe(
      tap(() => {
        this.isRefreshing = false;
        this.refreshTokenSubject$ = null;
      }),
      catchError((err) => {
        this.isRefreshing = false;
        this.refreshTokenSubject$ = null;
        this.clearSessionAndRedirect(APP_ROUTES.OFFICIAL.LOGIN);
        return throwError(() => err);
      }),
      shareReplay(1)
    );

    return this.refreshTokenSubject$;
  }

  logout(redirectUrl: string = APP_ROUTES.OFFICIAL.LOGIN): void {
    this.currentUser.set(null);
    this.clearSetupToken();

    this.http
      .post(API_ENDPOINTS.OFFICIAL.AUTH.LOGOUT, {})
      .pipe(catchError(() => of(null)))
      .subscribe({
        next: () => this.clearSessionAndRedirect(redirectUrl),
        error: () => this.clearSessionAndRedirect(redirectUrl)
      });
  }

  clearSessionAndRedirect(redirectUrl: string = APP_ROUTES.OFFICIAL.LOGIN): void {
    this.currentUser.set(null);
    this.clearSetupToken();
    if (this.router.url !== redirectUrl) {
      this.router.navigate([redirectUrl]);
    }
  }
}