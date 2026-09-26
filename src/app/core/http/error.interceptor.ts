import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';
import { AuthActions } from '../../features/auth/store/auth.actions';
import { SnackbarService } from '../services/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const store = inject(Store);
  const snackbar = inject(SnackbarService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        router.navigate(['/auth/login']);
      }
      if (error.status === 403 && error.error?.code === 'PERMISSION_DENIED') {
        // Permissão pode ter mudado desde que a tela abriu: avisa e recarrega o que o usuário pode fazer.
        snackbar.error(error.error?.message ?? 'Você não tem permissão para realizar esta ação');
        if (!req.url.endsWith('/api/me')) {
          store.dispatch(AuthActions.loadMe());
        }
      }
      return throwError(() => error);
    })
  );
};
