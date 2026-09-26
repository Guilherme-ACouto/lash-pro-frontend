import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../../core/models/auth.model';
import { AuthActions } from './auth.actions';

const initialState: AuthState = {
  user: null,
  brand: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  invitation: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { accessToken, refreshToken }) => ({
    ...state,
    accessToken,
    refreshToken,
    isLoading: false,
    isAuthenticated: true,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    isAuthenticated: false,
  })),
  on(AuthActions.logout, () => ({ ...initialState })),

  on(AuthActions.loadMeSuccess, (state, { user }) => ({ ...state, user, isAuthenticated: true })),
  on(AuthActions.loadBrandSuccess, (state, { brand }) => ({ ...state, brand })),

  on(AuthActions.forgotPassword, (state) => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.forgotPasswordSuccess, (state) => ({ ...state, isLoading: false })),
  on(AuthActions.forgotPasswordFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(AuthActions.resetPassword, (state) => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.resetPasswordSuccess, (state) => ({ ...state, isLoading: false })),
  on(AuthActions.resetPasswordFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(AuthActions.loadInvitation, (state) => ({ ...state, isLoading: true, error: null, invitation: null })),
  on(AuthActions.loadInvitationSuccess, (state, { invitation }) => ({ ...state, isLoading: false, invitation })),
  on(AuthActions.loadInvitationFailure, (state, { error }) => ({ ...state, isLoading: false, error })),
  on(AuthActions.acceptInvitation, (state) => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.acceptInvitationSuccess, (state) => ({ ...state, isLoading: false })),
  on(AuthActions.acceptInvitationFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(AuthActions.enterTenant, (state) => ({ ...state, isLoading: true })),
  on(AuthActions.enterTenantFailure, (state, { error }) => ({ ...state, isLoading: false, error })),
);
