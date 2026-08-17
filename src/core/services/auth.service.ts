import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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

  checkSession(): Observable<UserProfile | null> {
    return this.http.get<UserProfile>(`${this.apiUrl}/official/auth/me`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  login(credentials: LoginRequest): Observable<{ success: boolean; user_id: string }> {
    return this.http.post<{ success: boolean; user_id: string }>(
      `${this.apiUrl}/official/auth/login`,
      credentials
    ).pipe(
      tap(() => {
        this.checkSession().subscribe();
      })
    );
  }

  refreshToken(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/official/auth/refresh`, {});
  }

  logout(redirectUrl: string = '/official/login'): void {
    this.http.post(`${this.apiUrl}/official/auth/logout`, {}).subscribe({
      next: () => this.clearSessionAndRedirect(redirectUrl),
      error: () => this.clearSessionAndRedirect(redirectUrl)
    });
  }

  private clearSessionAndRedirect(redirectUrl: string): void {
    this.currentUser.set(null);
    this.router.navigate([redirectUrl]);
  }
}