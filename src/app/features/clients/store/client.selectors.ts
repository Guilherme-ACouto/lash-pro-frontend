import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientState } from '../../../core/models/client.model';

const selectClientState = createFeatureSelector<ClientState>('clients');

export const selectClients = createSelector(selectClientState, (s) => s.clients);
export const selectTotalElements = createSelector(selectClientState, (s) => s.totalElements);
export const selectCurrentPage = createSelector(selectClientState, (s) => s.currentPage);
export const selectPageSize = createSelector(selectClientState, (s) => s.pageSize);
export const selectSearch = createSelector(selectClientState, (s) => s.search);
export const selectSelectedClient = createSelector(selectClientState, (s) => s.selectedClient);
export const selectClientsLoading = createSelector(selectClientState, (s) => s.isLoading);
export const selectClientsSaving = createSelector(selectClientState, (s) => s.isSaving);
export const selectClientsError = createSelector(selectClientState, (s) => s.error);
