import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, UserProfile } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  readonly accessToken = signal<string | null>(localStorage.getItem('access_token'));
  readonly currentUser = signal<UserProfile | null>(null);
  readonly isAuthenticated = computed(() => !!this.accessToken());

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/official/auth/login`, credentials).pipe(
      tap((res) => {
        this.accessToken.set(res.accessToken);
        this.currentUser.set(res.user);
        localStorage.setItem('access_token', res.accessToken);
      })
    );
  }

  logout(redirectUrl: string = '/official/login'): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('access_token');
    this.router.navigate([redirectUrl]);
  }
}