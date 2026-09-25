import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

import { SnackbarService } from '../services/snackbar.service';
import { ALERT_MESSAGES, DEFAULT_ALERT_MESSAGE, X_BRAVAPRO_ALERT } from './alert-messages';

export const alertInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(SnackbarService);
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const key = event.headers.get(X_BRAVAPRO_ALERT);
        if (key) {
          snackbar.success(ALERT_MESSAGES[key] ?? DEFAULT_ALERT_MESSAGE);
        }
      }
    })
  );
};
