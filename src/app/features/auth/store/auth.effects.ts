import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { firstAllowedRoute } from '../../../core/auth/module-routes';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackbar = inject(SnackbarService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            })
          ),
          catchError((err) =>
            of(AuthActions.loginFailure({
              error: err.error?.message ?? 'Erro ao fazer login. Tente novamente.',
            }))
          )
        )
      )
    )
  );

  /** Depois do login: guarda os tokens, carrega usuário + permissões e abre a primeira tela liberada. */
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ accessToken, refreshToken }) => this.authService.saveTokens(accessToken, refreshToken)),
      map(() => AuthActions.loadMe())
    )
  );

  navigateAfterLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        switchMap(() => this.actions$.pipe(ofType(AuthActions.loadMeSuccess), take(1))),
        // Equipe da plataforma não trabalha na própria assinatura (interna): vai direto escolher em qual entrar.
        tap(({ user }) =>
          this.router.navigateByUrl(user.platformAdmin ? '/platform/tenants' : firstAllowedRoute(user))
        )
      ),
    { dispatch: false }
  );

  loadMe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadMe),
      switchMap(() =>
        this.authService.me().pipe(
          mergeMap((user) => [AuthActions.loadMeSuccess({ user }), AuthActions.loadBrand()]),
          catchError((err) =>
            of(AuthActions.loadMeFailure({ error: err.error?.message ?? 'Sessão inválida' }))
          )
        )
      )
    )
  );

  /** Sem usuário não dá pra montar menu nem liberar rotas: volta pro login. */
  loadMeFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadMeFailure),
      map(() => AuthActions.logout())
    )
  );

  loadBrand$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadBrand),
      switchMap(() =>
        this.authService.brand().pipe(
          map((brand) => AuthActions.loadBrandSuccess({ brand })),
          catchError(() => of({ type: '[Auth] Load Brand Ignored' }))
        )
      )
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.forgotPassword),
      switchMap(({ email }) =>
        this.authService.forgotPassword(email).pipe(
          map(() => AuthActions.forgotPasswordSuccess()),
          catchError((err) =>
            of(AuthActions.forgotPasswordFailure({
              error: err.error?.message ?? 'Erro ao enviar email.',
            }))
          )
        )
      )
    )
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      switchMap(({ token, password }) =>
        this.authService.resetPassword(token, password).pipe(
          map(() => AuthActions.resetPasswordSuccess()),
          catchError((err) =>
            of(AuthActions.resetPasswordFailure({
              error: err.error?.message ?? 'Não foi possível redefinir a senha.',
            }))
          )
        )
      )
    )
  );

  loadInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadInvitation),
      switchMap(({ token }) =>
        this.authService.getInvitation(token).pipe(
          map((invitation) => AuthActions.loadInvitationSuccess({ invitation })),
          catchError((err) =>
            of(AuthActions.loadInvitationFailure({
              error: err.error?.message ?? 'Convite inválido ou já utilizado.',
            }))
          )
        )
      )
    )
  );

  acceptInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.acceptInvitation),
      switchMap(({ token, name, password }) =>
        this.authService.acceptInvitation(token, name, password).pipe(
          map(() => AuthActions.acceptInvitationSuccess()),
          catchError((err) =>
            of(AuthActions.acceptInvitationFailure({
              error: err.error?.message ?? 'Não foi possível aceitar o convite.',
            }))
          )
        )
      )
    )
  );

  /** Modo suporte: guarda os tokens da própria conta e troca pelos da assinatura escolhida. */
  enterTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.enterTenant),
      switchMap(({ tenantId }) =>
        this.authService.enterTenant(tenantId).pipe(
          tap((session) => {
            this.authService.stashOwnTokens();
            this.authService.saveTokens(session.accessToken, session.refreshToken);
          }),
          map(() => AuthActions.loadMe()),
          catchError((err) => {
            const error = err.error?.message ?? 'Não foi possível entrar na assinatura.';
            this.snackbar.error(error);
            return of(AuthActions.enterTenantFailure({ error }));
          })
        )
      )
    )
  );

  navigateAfterEnterTenant$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.enterTenant),
        switchMap(() => this.actions$.pipe(ofType(AuthActions.loadMeSuccess), take(1))),
        tap(() => this.router.navigateByUrl('/dashboard'))
      ),
    { dispatch: false }
  );

  exitSupport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.exitSupport),
      map(() => (this.authService.restoreOwnTokens() ? AuthActions.loadMe() : AuthActions.logout()))
    )
  );

  navigateAfterExitSupport$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.exitSupport),
        switchMap(() => this.actions$.pipe(ofType(AuthActions.loadMeSuccess), take(1))),
        tap(() => this.router.navigateByUrl('/platform/tenants'))
      ),
    { dispatch: false }
  );
}
