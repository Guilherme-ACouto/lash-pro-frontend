import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, catchError, forkJoin, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { AuthActions } from '../../auth/store/auth.actions';
import { selectCurrentUser } from '../../auth/store/auth.selectors';
import { SettingsService } from '../services/settings.service';
import { SettingsActions } from './settings.actions';

@Injectable()
export class SettingsEffects {
  private actions$ = inject(Actions);
  private service = inject(SettingsService);
  private snackbar = inject(SnackbarService);
  private store = inject(Store);

  loadTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.loadTeam),
      switchMap(() =>
        forkJoin({ users: this.service.listUsers(), invites: this.service.listInvites() }).pipe(
          map(({ users, invites }) => SettingsActions.loadTeamSuccess({ users, invites })),
          catchError((err) => of(SettingsActions.loadTeamFailure({ error: message(err, 'Erro ao carregar a equipe') })))
        )
      )
    )
  );

  // Todo comando da equipe segue o mesmo ciclo: chama a API → sucesso recarrega a lista (o
  // snackbar de sucesso vem do header X-bravapro-alert) → erro mostra a mensagem do backend.
  inviteUser$ = this.teamCommand(SettingsActions.inviteUser, ({ request }) => this.service.invite(request));
  updateUser$ = this.teamCommand(SettingsActions.updateUser, ({ id, request }) => this.service.updateUser(id, request));
  deactivateUser$ = this.teamCommand(SettingsActions.deactivateUser, ({ id }) => this.service.deactivateUser(id));
  reactivateUser$ = this.teamCommand(SettingsActions.reactivateUser, ({ id }) => this.service.reactivateUser(id));
  deleteUser$ = this.teamCommand(SettingsActions.deleteUser, ({ id }) => this.service.deleteUser(id));
  resetUserPassword$ = this.teamCommand(SettingsActions.resetUserPassword, ({ id }) => this.service.resetPassword(id));
  endUserSessions$ = this.teamCommand(SettingsActions.endUserSessions, ({ id }) => this.service.endSessions(id));
  resendInvite$ = this.teamCommand(SettingsActions.resendInvite, ({ id }) => this.service.resendInvite(id));
  cancelInvite$ = this.teamCommand(SettingsActions.cancelInvite, ({ id }) => this.service.cancelInvite(id));

  reloadTeamAfterCommand$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.teamCommandSuccess),
      map(() => SettingsActions.loadTeam())
    )
  );

  /** Se a administração mexeu no próprio usuário, o menu/permissões dela também mudam. */
  refreshMeAfterUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.updateUser),
      withLatestFrom(this.store.select(selectCurrentUser)),
      switchMap(([{ id }, me]) =>
        id === me?.id
          ? this.actions$.pipe(ofType(SettingsActions.teamCommandSuccess), map(() => AuthActions.loadMe()))
          : of()
      )
    )
  );

  loadBusinessUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.loadBusinessUnit),
      switchMap(() =>
        this.service.getBusinessUnit().pipe(
          map((businessUnit) => SettingsActions.loadBusinessUnitSuccess({ businessUnit })),
          catchError((err) =>
            of(SettingsActions.loadBusinessUnitFailure({ error: message(err, 'Erro ao carregar a unidade de negócio') }))
          )
        )
      )
    )
  );

  saveBusinessUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.saveBusinessUnit),
      switchMap(({ id, request }) =>
        this.service.updateBusinessUnit(id, request).pipe(
          mergeMap(() => [
            SettingsActions.saveBusinessUnitSuccess(),
            SettingsActions.loadBusinessUnit(),
            AuthActions.loadBrand(),
          ]),
          catchError((err) => {
            const error = message(err, 'Erro ao salvar a unidade de negócio');
            this.snackbar.error(error);
            return of(SettingsActions.saveBusinessUnitFailure({ error }));
          })
        )
      )
    )
  );

  uploadLogo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.uploadLogo),
      switchMap(({ id, file }) => this.logoChange(this.service.uploadLogo(id, file)))
    )
  );

  removeLogo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.removeLogo),
      switchMap(({ id }) => this.logoChange(this.service.removeLogo(id)))
    )
  );

  lookupCep$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.lookupCep),
      switchMap(({ cep }) =>
        this.service.lookupCep(cep).pipe(
          map((address) =>
            address ? SettingsActions.lookupCepSuccess({ address }) : SettingsActions.lookupCepNotFound()
          ),
          catchError(() => of(SettingsActions.lookupCepNotFound()))
        )
      )
    )
  );

  cepNotFound$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SettingsActions.lookupCepNotFound),
        tap(() => this.snackbar.error('CEP não encontrado — preencha o endereço manualmente'))
      ),
    { dispatch: false }
  );

  private logoChange(request$: Observable<unknown>) {
    return request$.pipe(
      mergeMap(() => [SettingsActions.logoChangeSuccess(), SettingsActions.loadBusinessUnit(), AuthActions.loadBrand()]),
      catchError((err) => {
        const error = message(err, 'Erro ao atualizar o logo');
        this.snackbar.error(error);
        return of(SettingsActions.logoChangeFailure({ error }));
      })
    );
  }

  private teamCommand<A extends { type: string }>(
    actionCreator: { type: string } & ((...args: never[]) => A),
    call: (action: A) => Observable<unknown>
  ) {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(actionCreator.type),
        mergeMap((action) =>
          call(action as A).pipe(
            map(() => SettingsActions.teamCommandSuccess()),
            catchError((err) => {
              const error = message(err, 'Não foi possível concluir a ação');
              this.snackbar.error(error);
              return of(SettingsActions.teamCommandFailure({ error }));
            })
          )
        )
      )
    );
  }
}

function message(err: { error?: { message?: string } }, fallback: string): string {
  return err?.error?.message ?? fallback;
}
