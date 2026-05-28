import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentActions } from './appointment.actions';
import { selectSelectedAppointment } from './appointment.selectors';

@Injectable()
export class AppointmentEffects {
  private actions$ = inject(Actions);
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);
  private store = inject(Store);

  loadAppointments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.loadAppointments),
      switchMap(({ date }) =>
        this.appointmentService.listByDate(date).pipe(
          map((appointments) => AppointmentActions.loadAppointmentsSuccess({ appointments })),
          catchError((err) =>
            of(AppointmentActions.loadAppointmentsFailure({
              error: err.error?.message ?? 'Erro ao carregar agenda',
            }))
          )
        )
      )
    )
  );

  setDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.setDate),
      map(({ date }) => AppointmentActions.loadAppointments({ date }))
    )
  );

  selectAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.selectAppointment),
      switchMap(({ id }) =>
        this.appointmentService.getById(id).pipe(
          map((appointment) => AppointmentActions.selectAppointmentSuccess({ appointment })),
          catchError((err) =>
            of(AppointmentActions.selectAppointmentFailure({
              error: err.error?.message ?? 'Agendamento não encontrado',
            }))
          )
        )
      )
    )
  );

  createAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.createAppointment),
      switchMap(({ request }) =>
        this.appointmentService.create(request).pipe(
          map((appointment) => AppointmentActions.createAppointmentSuccess({ appointment })),
          catchError((err) =>
            of(AppointmentActions.createAppointmentFailure({
              error: err.error?.message ?? 'Erro ao criar agendamento',
            }))
          )
        )
      )
    )
  );

  createAppointmentSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentActions.createAppointmentSuccess),
        tap(() => this.router.navigate(['/appointments']))
      ),
    { dispatch: false }
  );

  updateAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.updateAppointment),
      switchMap(({ id, request }) =>
        this.appointmentService.update(id, request).pipe(
          map((appointment) => AppointmentActions.updateAppointmentSuccess({ appointment })),
          catchError((err) =>
            of(AppointmentActions.updateAppointmentFailure({
              error: err.error?.message ?? 'Erro ao atualizar agendamento',
            }))
          )
        )
      )
    )
  );

  updateAppointmentSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentActions.updateAppointmentSuccess),
        tap(({ appointment }) => this.router.navigate(['/appointments', appointment.id]))
      ),
    { dispatch: false }
  );

  confirmAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.confirmAppointment),
      switchMap(({ id }) =>
        this.appointmentService.confirm(id).pipe(
          map(() => AppointmentActions.confirmAppointmentSuccess()),
          catchError((err) =>
            of(AppointmentActions.confirmAppointmentFailure({
              error: err.error?.message ?? 'Erro ao confirmar',
            }))
          )
        )
      )
    )
  );

  confirmAppointmentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.confirmAppointmentSuccess),
      withLatestFrom(this.store.select(selectSelectedAppointment)),
      map(([, appointment]) => {
        if (appointment) {
          return AppointmentActions.selectAppointment({ id: appointment.id });
        }
        return AppointmentActions.loadAppointments({ date: new Date().toISOString().split('T')[0] });
      })
    )
  );

  completeAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.completeAppointment),
      switchMap(({ id, paymentMethod }) =>
        this.appointmentService.complete(id, paymentMethod).pipe(
          map(() => AppointmentActions.completeAppointmentSuccess()),
          catchError((err) =>
            of(AppointmentActions.completeAppointmentFailure({
              error: err.error?.message ?? 'Erro ao concluir',
            }))
          )
        )
      )
    )
  );

  completeAppointmentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.completeAppointmentSuccess),
      withLatestFrom(this.store.select(selectSelectedAppointment)),
      map(([, appointment]) => {
        if (appointment) {
          return AppointmentActions.selectAppointment({ id: appointment.id });
        }
        return AppointmentActions.loadAppointments({ date: new Date().toISOString().split('T')[0] });
      })
    )
  );

  cancelAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.cancelAppointment),
      switchMap(({ id }) =>
        this.appointmentService.cancel(id).pipe(
          map(() => AppointmentActions.cancelAppointmentSuccess()),
          catchError((err) =>
            of(AppointmentActions.cancelAppointmentFailure({
              error: err.error?.message ?? 'Erro ao cancelar',
            }))
          )
        )
      )
    )
  );

  cancelAppointmentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.cancelAppointmentSuccess),
      withLatestFrom(this.store.select(selectSelectedAppointment)),
      map(([, appointment]) => {
        if (appointment) {
          return AppointmentActions.selectAppointment({ id: appointment.id });
        }
        return AppointmentActions.loadAppointments({ date: new Date().toISOString().split('T')[0] });
      })
    )
  );

  noShowAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.noShowAppointment),
      switchMap(({ id }) =>
        this.appointmentService.noShow(id).pipe(
          map(() => AppointmentActions.noShowAppointmentSuccess()),
          catchError((err) =>
            of(AppointmentActions.noShowAppointmentFailure({
              error: err.error?.message ?? 'Erro ao registrar não comparecimento',
            }))
          )
        )
      )
    )
  );

  noShowAppointmentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.noShowAppointmentSuccess),
      withLatestFrom(this.store.select(selectSelectedAppointment)),
      map(([, appointment]) => {
        if (appointment) {
          return AppointmentActions.selectAppointment({ id: appointment.id });
        }
        return AppointmentActions.loadAppointments({ date: new Date().toISOString().split('T')[0] });
      })
    )
  );
}
