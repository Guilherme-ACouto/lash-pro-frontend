import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Tenant } from '../models/platform.model';
import { PlatformActions } from './platform.actions';

export interface PlatformState {
  tenants: Tenant[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PlatformState = { tenants: [], isLoading: false, error: null };

export const platformReducer = createReducer(
  initialState,
  on(PlatformActions.loadTenants, (state) => ({ ...state, isLoading: true, error: null })),
  on(PlatformActions.loadTenantsSuccess, (state, { tenants }) => ({ ...state, isLoading: false, tenants })),
  on(PlatformActions.loadTenantsFailure, (state, { error }) => ({ ...state, isLoading: false, error })),
);

const selectPlatformState = createFeatureSelector<PlatformState>('platform');
export const selectTenants = createSelector(selectPlatformState, (s) => s.tenants);
export const selectTenantsLoading = createSelector(selectPlatformState, (s) => s.isLoading);
