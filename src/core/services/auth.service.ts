import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, shareReplay, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, UserProfile } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  readonly currentUser = signal<UserProfile | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly permissions = computed(() => this.currentUser()?.permissions ?? []);
  readonly role = computed(() => this.currentUser()?.role ?? null);

  private isRefreshing = false;
  private refreshTokenSubject$: Observable<void> | null = null;

  checkSession(): Observable<UserProfile | null> {
    return this.http.get<UserProfile>(`${this.apiUrl}/official/auth/me`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  login(credentials: LoginRequest): Observable<UserProfile | null> {
    return this.http.post<{ success: boolean; user_id: string }>(
      `${this.apiUrl}/official/auth/login`,
      credentials
    ).pipe(
      switchMap(() => this.checkSession())
    );
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

    this.refreshTokenSubject$ = this.http.post<void>(`${this.apiUrl}/official/auth/refresh`, {}).pipe(
      tap(() => {
        this.isRefreshing = false;
        this.refreshTokenSubject$ = null;
      }),
      catchError((err) => {
        this.isRefreshing = false;
        this.refreshTokenSubject$ = null;
        this.clearSessionAndRedirect('/official/login');
        return throwError(() => err);
      }),
      shareReplay(1)
    );

    return this.refreshTokenSubject$;
  }

  logout(redirectUrl: string = '/official/login'): void {
    this.currentUser.set(null);

    this.http.post(`${this.apiUrl}/official/auth/logout`, {}).pipe(
      catchError(() => of(null))
    ).subscribe({
      next: () => this.clearSessionAndRedirect(redirectUrl),
      error: () => this.clearSessionAndRedirect(redirectUrl)
    });
  }

  clearSessionAndRedirect(redirectUrl: string = '/official/login'): void {
    this.currentUser.set(null);
    if (this.router.url !== redirectUrl) {
      this.router.navigate([redirectUrl]);
    }
  }
}