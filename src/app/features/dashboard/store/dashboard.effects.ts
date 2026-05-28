import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { DashboardService } from '../services/dashboard.service';
import { DashboardActions } from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private dashboardService = inject(DashboardService);

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboard),
      switchMap(({ period }) =>
        this.dashboardService.get(period).pipe(
          map((data) => DashboardActions.loadDashboardSuccess({ data })),
          catchError((err) =>
            of(DashboardActions.loadDashboardFailure({
              error: err.error?.message ?? 'Erro ao carregar dashboard',
            }))
          )
        )
      )
    )
  );

  setPeriod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.setPeriod),
      map(({ period }) => DashboardActions.loadDashboard({ period }))
    )
  );
}
