import { HttpInterceptorFn } from '@angular/common/http';

/** Token só vai pra API do próprio sistema — nunca pra serviços externos (ex.: ViaCEP). */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  if (token && req.url.startsWith('/api/')) {
    return next(req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }));
  }
  return next(req);
};
