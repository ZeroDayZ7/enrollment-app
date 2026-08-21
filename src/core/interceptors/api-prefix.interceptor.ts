import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (
    req.url.startsWith('http://') ||
    req.url.startsWith('https://') ||
    req.url.startsWith('./assets/') ||
    req.url.startsWith('assets/')
  ) {
    return next(req);
  }

  const baseUrl = environment.apiUrl.endsWith('/')
    ? environment.apiUrl.slice(0, -1)
    : environment.apiUrl;

  const endpoint = req.url.startsWith('/') ? req.url : `/${req.url}`;

  return next(req.clone({ url: `${baseUrl}${endpoint}` }));
};