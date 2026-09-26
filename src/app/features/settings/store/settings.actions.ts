import { createAction, props } from '@ngrx/store';
import {
  BusinessUnit,
  CepAddress,
  InviteUserRequest,
  TeamInvite,
  TeamUser,
  UpdateBusinessUnitRequest,
  UpdateTeamUserRequest,
} from '../models/settings.model';

export const SettingsActions = {
  // Equipe (usuários + convites pendentes)
  loadTeam: createAction('[Settings] Load Team'),
  loadTeamSuccess: createAction('[Settings] Load Team Success', props<{ users: TeamUser[]; invites: TeamInvite[] }>()),
  loadTeamFailure: createAction('[Settings] Load Team Failure', props<{ error: string }>()),

  inviteUser: createAction('[Settings] Invite User', props<{ request: InviteUserRequest }>()),
  updateUser: createAction('[Settings] Update User', props<{ id: string; request: UpdateTeamUserRequest }>()),
  deactivateUser: createAction('[Settings] Deactivate User', props<{ id: string }>()),
  reactivateUser: createAction('[Settings] Reactivate User', props<{ id: string }>()),
  deleteUser: createAction('[Settings] Delete User', props<{ id: string }>()),
  resetUserPassword: createAction('[Settings] Reset User Password', props<{ id: string }>()),
  endUserSessions: createAction('[Settings] End User Sessions', props<{ id: string }>()),
  resendInvite: createAction('[Settings] Resend Invite', props<{ id: string }>()),
  cancelInvite: createAction('[Settings] Cancel Invite', props<{ id: string }>()),

  /** Qualquer comando da equipe que deu certo — recarrega a lista e fecha o diálogo aberto. */
  teamCommandSuccess: createAction('[Settings] Team Command Success'),
  teamCommandFailure: createAction('[Settings] Team Command Failure', props<{ error: string }>()),

  // Unidade de negócio
  loadBusinessUnit: createAction('[Settings] Load Business Unit'),
  loadBusinessUnitSuccess: createAction('[Settings] Load Business Unit Success', props<{ businessUnit: BusinessUnit }>()),
  loadBusinessUnitFailure: createAction('[Settings] Load Business Unit Failure', props<{ error: string }>()),

  saveBusinessUnit: createAction('[Settings] Save Business Unit', props<{ id: string; request: UpdateBusinessUnitRequest }>()),
  saveBusinessUnitSuccess: createAction('[Settings] Save Business Unit Success'),
  saveBusinessUnitFailure: createAction('[Settings] Save Business Unit Failure', props<{ error: string }>()),

  uploadLogo: createAction('[Settings] Upload Logo', props<{ id: string; file: File }>()),
  removeLogo: createAction('[Settings] Remove Logo', props<{ id: string }>()),
  logoChangeSuccess: createAction('[Settings] Logo Change Success'),
  logoChangeFailure: createAction('[Settings] Logo Change Failure', props<{ error: string }>()),

  lookupCep: createAction('[Settings] Lookup Cep', props<{ cep: string }>()),
  lookupCepSuccess: createAction('[Settings] Lookup Cep Success', props<{ address: CepAddress }>()),
  lookupCepNotFound: createAction('[Settings] Lookup Cep Not Found'),
};
