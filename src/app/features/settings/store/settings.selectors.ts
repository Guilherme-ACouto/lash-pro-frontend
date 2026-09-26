import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from './settings.reducer';

const selectSettingsState = createFeatureSelector<SettingsState>('settings');

export const selectTeamUsers = createSelector(selectSettingsState, (s) => s.users);
export const selectTeamInvites = createSelector(selectSettingsState, (s) => s.invites);
export const selectBusinessUnit = createSelector(selectSettingsState, (s) => s.businessUnit);
export const selectSettingsLoading = createSelector(selectSettingsState, (s) => s.isLoading);
export const selectSettingsSaving = createSelector(selectSettingsState, (s) => s.isSaving);
export const selectCepLoading = createSelector(selectSettingsState, (s) => s.isLookingUpCep);
