import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../../core/models/auth.model';

const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(selectAuthState, (s) => s.isAuthenticated);
export const selectCurrentUser = createSelector(selectAuthState, (s) => s.user);
export const selectAuthLoading = createSelector(selectAuthState, (s) => s.isLoading);
export const selectAuthError = createSelector(selectAuthState, (s) => s.error);
export const selectAccessToken = createSelector(selectAuthState, (s) => s.accessToken);
