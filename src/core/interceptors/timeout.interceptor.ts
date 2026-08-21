import { HttpInterceptorFn } from '@angular/common/http';
import { throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  const DEFAULT_TIMEOUT_MS = 10000; // 10 sekund

  return next(req).pipe(
    timeout(DEFAULT_TIMEOUT_MS),
    catchError((err) => {
      if (err instanceof TimeoutError) {
        console.error(`[TimeoutInterceptor] Przekroczono limit czasu (${DEFAULT_TIMEOUT_MS}ms) dla: ${req.url}`);
      }
      return throwError(() => err);
    })
  );
};