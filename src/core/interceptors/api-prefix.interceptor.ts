import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
    const baseUrl = environment.apiUrl.endsWith('/')
      ? environment.apiUrl.slice(0, -1)
      : environment.apiUrl;

    const endpoint = req.url.startsWith('/') ? req.url : `/${req.url}`;

    const apiReq = req.clone({
      url: `${baseUrl}${endpoint}`
    });

    return next(apiReq);
  }

  return next(req);
};