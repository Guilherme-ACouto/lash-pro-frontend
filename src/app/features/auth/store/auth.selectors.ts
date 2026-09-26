import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, User } from '../../../core/models/auth.model';

const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(selectAuthState, (s) => s.isAuthenticated);
export const selectCurrentUser = createSelector(selectAuthState, (s) => s.user);
export const selectBrand = createSelector(selectAuthState, (s) => s.brand);
export const selectAuthLoading = createSelector(selectAuthState, (s) => s.isLoading);
export const selectAuthError = createSelector(selectAuthState, (s) => s.error);
export const selectAccessToken = createSelector(selectAuthState, (s) => s.accessToken);
export const selectInvitation = createSelector(selectAuthState, (s) => s.invitation);

export const selectIsAdmin = createSelector(selectCurrentUser, (u) => !!u?.admin);
export const selectIsPlatformAdmin = createSelector(selectCurrentUser, (u) => !!u?.platformAdmin);
export const selectIsSupportSession = createSelector(selectCurrentUser, (u) => !!u?.supportSession);

/** Administrador tem tudo; os demais precisam da chave (ex.: "client.create"). */
export function userCan(user: User | null, permission: string): boolean {
  if (!user) return false;
  return user.admin || user.permissions.includes(permission);
}

export const selectCan = (permission: string) =>
  createSelector(selectCurrentUser, (user) => userCan(user, permission));
