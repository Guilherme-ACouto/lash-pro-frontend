import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { PlatformService } from '../services/platform.service';
import { PlatformActions } from './platform.actions';

@Injectable()
export class PlatformEffects {
  private actions$ = inject(Actions);
  private service = inject(PlatformService);

  loadTenants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlatformActions.loadTenants),
      switchMap(() =>
        this.service.listTenants().pipe(
          map((page) => PlatformActions.loadTenantsSuccess({ tenants: page.content })),
          catchError((err) =>
            of(PlatformActions.loadTenantsFailure({ error: err.error?.message ?? 'Erro ao carregar assinaturas' }))
          )
        )
      )
    )
  );
}
