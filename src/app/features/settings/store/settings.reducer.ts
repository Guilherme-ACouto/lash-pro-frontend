import { createReducer, on } from '@ngrx/store';
import { BusinessUnit, TeamInvite, TeamUser } from '../models/settings.model';
import { SettingsActions } from './settings.actions';

export interface SettingsState {
  users: TeamUser[];
  invites: TeamInvite[];
  businessUnit: BusinessUnit | null;
  isLoading: boolean;
  isSaving: boolean;
  isLookingUpCep: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  users: [],
  invites: [],
  businessUnit: null,
  isLoading: false,
  isSaving: false,
  isLookingUpCep: false,
  error: null,
};

const saving = (state: SettingsState): SettingsState => ({ ...state, isSaving: true, error: null });
const saved = (state: SettingsState): SettingsState => ({ ...state, isSaving: false });
const failed = (state: SettingsState, { error }: { error: string }): SettingsState => ({
  ...state,
  isSaving: false,
  isLoading: false,
  error,
});

export const settingsReducer = createReducer(
  initialState,

  on(SettingsActions.loadTeam, (state) => ({ ...state, isLoading: true, error: null })),
  on(SettingsActions.loadTeamSuccess, (state, { users, invites }) => ({ ...state, isLoading: false, users, invites })),
  on(SettingsActions.loadTeamFailure, failed),

  on(
    SettingsActions.inviteUser,
    SettingsActions.updateUser,
    SettingsActions.deactivateUser,
    SettingsActions.reactivateUser,
    SettingsActions.deleteUser,
    SettingsActions.resetUserPassword,
    SettingsActions.endUserSessions,
    SettingsActions.resendInvite,
    SettingsActions.cancelInvite,
    saving
  ),
  on(SettingsActions.teamCommandSuccess, saved),
  on(SettingsActions.teamCommandFailure, failed),

  on(SettingsActions.loadBusinessUnit, (state) => ({ ...state, isLoading: true, error: null })),
  on(SettingsActions.loadBusinessUnitSuccess, (state, { businessUnit }) => ({ ...state, isLoading: false, businessUnit })),
  on(SettingsActions.loadBusinessUnitFailure, failed),

  on(SettingsActions.saveBusinessUnit, SettingsActions.uploadLogo, SettingsActions.removeLogo, saving),
  on(SettingsActions.saveBusinessUnitSuccess, SettingsActions.logoChangeSuccess, saved),
  on(SettingsActions.saveBusinessUnitFailure, SettingsActions.logoChangeFailure, failed),

  on(SettingsActions.lookupCep, (state) => ({ ...state, isLookingUpCep: true })),
  on(SettingsActions.lookupCepSuccess, SettingsActions.lookupCepNotFound, (state) => ({ ...state, isLookingUpCep: false })),
);
