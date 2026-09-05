import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ServiceService } from '../services/service.service';
import { ServiceActions } from './service.actions';

@Injectable()
export class ServiceEffects {
  private actions$ = inject(Actions);
  private serviceService = inject(ServiceService);
  private router = inject(Router);

  loadServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.loadServices),
      switchMap(({ search, page, active }) =>
        this.serviceService.list(search ?? '', page ?? 0, 20, active).pipe(
          map(response =>
            ServiceActions.loadServicesSuccess({
              services: response.content,
              totalElements: response.totalElements,
              page: response.page,
            })
          ),
          catchError(err =>
            of(ServiceActions.loadServicesFailure({
              error: err.error?.message ?? 'Erro ao carregar serviços',
            }))
          )
        )
      )
    )
  );

  selectService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.selectService),
      switchMap(({ id }) =>
        this.serviceService.getById(id).pipe(
          map(service => ServiceActions.selectServiceSuccess({ service })),
          catchError(err =>
            of(ServiceActions.selectServiceFailure({
              error: err.error?.message ?? 'Erro ao carregar serviço',
            }))
          )
        )
      )
    )
  );

  createService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.createService),
      switchMap(({ request }) =>
        this.serviceService.create(request).pipe(
          map(service => ServiceActions.createServiceSuccess({ service })),
          catchError(err =>
            of(ServiceActions.createServiceFailure({
              error: err.error?.message ?? 'Erro ao criar serviço',
            }))
          )
        )
      )
    )
  );

  createServiceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.createServiceSuccess),
      tap(() => this.router.navigate(['/services']))
    ),
    { dispatch: false }
  );

  updateService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.updateService),
      switchMap(({ id, request }) =>
        this.serviceService.update(id, request).pipe(
          switchMap(() => this.serviceService.getById(id)),
          map(service => ServiceActions.updateServiceSuccess({ service })),
          catchError(err =>
            of(ServiceActions.updateServiceFailure({
              error: err.error?.message ?? 'Erro ao atualizar serviço',
            }))
          )
        )
      )
    )
  );

  updateServiceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.updateServiceSuccess),
      tap(({ service }) => this.router.navigate(['/services', service.id]))
    ),
    { dispatch: false }
  );

  deactivateService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.deactivateService),
      switchMap(({ id, force }) =>
        this.serviceService.deactivate(id, force).pipe(
          map(() => ServiceActions.deactivateServiceSuccess({ id })),
          catchError(err => {
            if (err.status === 409 && err.error?.count) {
              const count = err.error.count;
              const msg = err.error.message || `Este serviço tem ${count} agendamento(s) futuro(s). Desativar mesmo assim?`;
              if (confirm(msg)) {
                return of(ServiceActions.deactivateService({ id, force: true }));
              }
            }
            return of(ServiceActions.deactivateServiceFailure({
              error: err.error?.message ?? 'Erro ao desativar serviço',
            }));
          })
        )
      )
    )
  );

  reactivateService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.reactivateService),
      switchMap(({ id }) =>
        this.serviceService.reactivate(id).pipe(
          map(() => ServiceActions.reactivateServiceSuccess({ id })),
          catchError(err =>
            of(ServiceActions.reactivateServiceFailure({
              error: err.error?.message ?? 'Erro ao reativar serviço',
            }))
          )
        )
      )
    )
  );

  deleteService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.deleteService),
      switchMap(({ id }) =>
        this.serviceService.delete(id).pipe(
          map(() => ServiceActions.deleteServiceSuccess({ id })),
          catchError(err =>
            of(ServiceActions.deleteServiceFailure({
              error: err.error?.message ?? 'Erro ao excluir serviço',
            }))
          )
        )
      )
    )
  );

  deleteServiceSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServiceActions.deleteServiceSuccess),
        tap(() => this.router.navigate(['/services']))
      ),
    { dispatch: false }
  );
}
