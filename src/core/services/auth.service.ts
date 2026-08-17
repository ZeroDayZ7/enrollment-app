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
    // Od razu czyścimy profil lokalny
    this.currentUser.set(null);

    // Próbujemy powiadomić backend o wylogowaniu
    this.http.post(`${this.apiUrl}/official/auth/logout`, {}).pipe(
      catchError(() => of(null)) // ignorujemy błąd 401 przy wylogowaniu
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