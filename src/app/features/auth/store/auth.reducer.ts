import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../../core/models/auth.model';
import { AuthActions } from './auth.actions';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { user, accessToken, refreshToken }) => ({
    ...state,
    user,
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
  on(AuthActions.forgotPassword, (state) => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.forgotPasswordSuccess, (state) => ({ ...state, isLoading: false })),
  on(AuthActions.forgotPasswordFailure, (state, { error }) => ({ ...state, isLoading: false, error })),
  on(AuthActions.initAuthSuccess, (state, { user, accessToken, refreshToken }) => ({
    ...state,
    user,
    accessToken,
    refreshToken,
    isAuthenticated: true,
  })),
);
