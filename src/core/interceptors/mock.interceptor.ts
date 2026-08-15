import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { LoginResponse } from '../models/auth.model';

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  // Przechwycenie logowania
  if (req.url.endsWith('/auth/login') && req.method === 'POST') {
    const mockResponse: LoginResponse = {
      accessToken: 'mocked-jwt-token-xyz-1234567890',
      user: {
        id: 'OP-88421',
        role: 'OFFICIAL_OPERATOR',
        permissions: ['CREATE_USER', 'READ_CONTRACT', 'SIGN_CONTRACT']
      }
    };

    // Symulacja opóźnienia sieciowego (500ms) i zwrot odpowiedzi HTTP 200 OK
    return of(new HttpResponse({ status: 200, body: mockResponse })).pipe(
      delay(500)
    );
  }

  // Wymuszenie zalogowania/sukcesu dla pozostałych przyszłych zapytań API
  if (req.url.includes('/api/v1/')) {
    return of(new HttpResponse({ status: 200, body: { status: 'success' } })).pipe(
      delay(300)
    );
  }

  return next(req);
};