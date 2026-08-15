import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, UserProfile } from '../models/auth.model';

export function login(
  http: HttpClient,
  apiUrl: string,
  credentials: LoginRequest,
  accessToken: ReturnType<typeof signal<string | null>>,
  currentUser: ReturnType<typeof signal<UserProfile | null>>
): Observable<LoginResponse> {
  return http.post<LoginResponse>(`${apiUrl}/auth/login`, credentials).pipe(
    tap((res) => {
      accessToken.set(res.accessToken);
      currentUser.set(res.user);
      localStorage.setItem('access_token', res.accessToken);
    })
  );
}

export function logout(
  router: Router,
  accessToken: ReturnType<typeof signal<string | null>>,
  currentUser: ReturnType<typeof signal<UserProfile | null>>,
  redirectUrl: string = '/official/login'
): void {
  accessToken.set(null);
  currentUser.set(null);
  localStorage.removeItem('access_token');
  router.navigate([redirectUrl]);
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:8082/api/v1';

  readonly accessToken = signal<string | null>(localStorage.getItem('access_token'));
  readonly currentUser = signal<UserProfile | null>(null);
  readonly isAuthenticated = computed(() => !!this.accessToken());

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return login(this.http, this.apiUrl, credentials, this.accessToken, this.currentUser);
  }

  logout(redirectUrl: string = '/official/login'): void {
    logout(this.router, this.accessToken, this.currentUser, redirectUrl);
  }
}