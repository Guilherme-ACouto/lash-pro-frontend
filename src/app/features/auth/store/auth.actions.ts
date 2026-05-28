import { createAction, props } from '@ngrx/store';
import { User } from '../../../core/models/auth.model';

export const AuthActions = {
  login: createAction(
    '[Auth] Login',
    props<{ email: string; password: string }>()
  ),
  loginSuccess: createAction(
    '[Auth] Login Success',
    props<{ user: User; accessToken: string; refreshToken: string }>()
  ),
  loginFailure: createAction(
    '[Auth] Login Failure',
    props<{ error: string }>()
  ),
  logout: createAction('[Auth] Logout'),
  forgotPassword: createAction(
    '[Auth] Forgot Password',
    props<{ email: string }>()
  ),
  forgotPasswordSuccess: createAction('[Auth] Forgot Password Success'),
  forgotPasswordFailure: createAction(
    '[Auth] Forgot Password Failure',
    props<{ error: string }>()
  ),
  initAuth: createAction('[Auth] Init Auth'),
  initAuthSuccess: createAction(
    '[Auth] Init Auth Success',
    props<{ user: User; accessToken: string; refreshToken: string }>()
  ),
};
