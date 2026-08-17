import { HttpInterceptorFn } from '@angular/common/http';
import { getOrCreateDeviceFingerprint } from '../utils/device-fingerprint';

export const deviceFingerprintInterceptor: HttpInterceptorFn = (req, next) => {
  const fingerprint = getOrCreateDeviceFingerprint();

  const clonedReq = req.clone({
    setHeaders: {
      'X-Device-Fingerprint': fingerprint
    }
  });

  return next(clonedReq);
};