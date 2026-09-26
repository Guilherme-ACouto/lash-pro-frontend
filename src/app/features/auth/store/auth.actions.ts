import { createAction, props } from '@ngrx/store';
import { Brand, InvitationDetails, User } from '../../../core/models/auth.model';

export const AuthActions = {
  login: createAction(
    '[Auth] Login',
    props<{ email: string; password: string }>()
  ),
  loginSuccess: createAction(
    '[Auth] Login Success',
    props<{ accessToken: string; refreshToken: string }>()
  ),
  loginFailure: createAction(
    '[Auth] Login Failure',
    props<{ error: string }>()
  ),
  logout: createAction('[Auth] Logout'),

  // Usuário logado + permissões (GET /api/me)
  loadMe: createAction('[Auth] Load Me'),
  loadMeSuccess: createAction('[Auth] Load Me Success', props<{ user: User }>()),
  loadMeFailure: createAction('[Auth] Load Me Failure', props<{ error: string }>()),

  // Nome + logo da empresa pro cabeçalho
  loadBrand: createAction('[Auth] Load Brand'),
  loadBrandSuccess: createAction('[Auth] Load Brand Success', props<{ brand: Brand }>()),

  forgotPassword: createAction(
    '[Auth] Forgot Password',
    props<{ email: string }>()
  ),
  forgotPasswordSuccess: createAction('[Auth] Forgot Password Success'),
  forgotPasswordFailure: createAction(
    '[Auth] Forgot Password Failure',
    props<{ error: string }>()
  ),

  resetPassword: createAction(
    '[Auth] Reset Password',
    props<{ token: string; password: string }>()
  ),
  resetPasswordSuccess: createAction('[Auth] Reset Password Success'),
  resetPasswordFailure: createAction(
    '[Auth] Reset Password Failure',
    props<{ error: string }>()
  ),

  // Convite (rota pública /auth/convite)
  loadInvitation: createAction('[Auth] Load Invitation', props<{ token: string }>()),
  loadInvitationSuccess: createAction(
    '[Auth] Load Invitation Success',
    props<{ invitation: InvitationDetails }>()
  ),
  loadInvitationFailure: createAction('[Auth] Load Invitation Failure', props<{ error: string }>()),
  acceptInvitation: createAction(
    '[Auth] Accept Invitation',
    props<{ token: string; name: string; password: string }>()
  ),
  acceptInvitationSuccess: createAction('[Auth] Accept Invitation Success'),
  acceptInvitationFailure: createAction('[Auth] Accept Invitation Failure', props<{ error: string }>()),

  // Modo suporte (equipe da plataforma)
  enterTenant: createAction('[Auth] Enter Tenant', props<{ tenantId: string }>()),
  enterTenantFailure: createAction('[Auth] Enter Tenant Failure', props<{ error: string }>()),
  exitSupport: createAction('[Auth] Exit Support'),
};
