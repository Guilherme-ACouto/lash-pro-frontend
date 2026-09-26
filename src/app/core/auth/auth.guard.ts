import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, take, tap } from 'rxjs';
import { AuthActions } from '../../features/auth/store/auth.actions';
import { selectCurrentUser } from '../../features/auth/store/auth.selectors';
import { User } from '../models/auth.model';
import { canAccess, firstAllowedRoute } from './module-routes';

/**
 * Área logada: exige token e, se o usuário ainda não foi carregado (ex.: recarregou a página),
 * dispara o GET /api/me. Os guards de módulo esperam esse carregamento.
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const store = inject(Store);
  if (!localStorage.getItem('access_token')) {
    return router.createUrlTree(['/auth/login']);
  }
  return store.select(selectCurrentUser).pipe(
    take(1),
    tap((user) => {
      if (!user) store.dispatch(AuthActions.loadMe());
    }),
    map(() => true)
  );
};

function waitForUser(check: (user: User) => boolean): CanActivateFn {
  return () => {
    const router = inject(Router);
    return inject(Store)
      .select(selectCurrentUser)
      .pipe(
        filter((user): user is User => !!user),
        take(1),
        map((user) => (check(user) ? true : router.parseUrl(firstAllowedRoute(user))))
      );
  };
}

/** Módulo exige a permissão de leitura (chave raiz, ex.: "financial"); administrador passa direto. */
export const permissionGuard = (permission: string): CanActivateFn =>
  waitForUser((user) => canAccess(user, permission));

/** Configurações: só administrador da assinatura. */
export const adminGuard: CanActivateFn = waitForUser((user) => user.admin);

/** Área da plataforma (lista de assinaturas): só e-mails do domínio Brava Pro. */
export const platformAdminGuard: CanActivateFn = waitForUser((user) => user.platformAdmin);
