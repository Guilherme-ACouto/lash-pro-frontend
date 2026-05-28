import { createReducer, on } from '@ngrx/store';
import { ClientState } from '../../../core/models/client.model';
import { ClientActions } from './client.actions';

const initialState: ClientState = {
  clients: [],
  totalElements: 0,
  currentPage: 0,
  pageSize: 20,
  search: '',
  selectedClient: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export const clientReducer = createReducer(
  initialState,

  on(ClientActions.loadClients, (state, { search, page }) => ({
    ...state,
    isLoading: true,
    error: null,
    search: search ?? state.search,
    currentPage: page ?? 0,
  })),
  on(ClientActions.loadClientsSuccess, (state, { clients, totalElements, page }) => ({
    ...state,
    isLoading: false,
    clients,
    totalElements,
    currentPage: page,
  })),
  on(ClientActions.loadClientsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(ClientActions.selectClient, (state) => ({ ...state, isLoading: true, error: null })),
  on(ClientActions.selectClientSuccess, (state, { client }) => ({
    ...state,
    isLoading: false,
    selectedClient: client,
  })),
  on(ClientActions.selectClientFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(ClientActions.clearSelectedClient, (state) => ({
    ...state,
    selectedClient: null,
  })),

  on(ClientActions.createClient, (state) => ({ ...state, isSaving: true, error: null })),
  on(ClientActions.createClientSuccess, (state, { client }) => ({
    ...state,
    isSaving: false,
    clients: [client, ...state.clients],
    totalElements: state.totalElements + 1,
  })),
  on(ClientActions.createClientFailure, (state, { error }) => ({
    ...state,
    isSaving: false,
    error,
  })),

  on(ClientActions.updateClient, (state) => ({ ...state, isSaving: true, error: null })),
  on(ClientActions.updateClientSuccess, (state, { client }) => ({
    ...state,
    isSaving: false,
    selectedClient: client,
    clients: state.clients.map((c) => (c.id === client.id ? client : c)),
  })),
  on(ClientActions.updateClientFailure, (state, { error }) => ({
    ...state,
    isSaving: false,
    error,
  })),

  on(ClientActions.deactivateClientSuccess, (state, { id }) => ({
    ...state,
    clients: state.clients.map((c) => c.id === id ? { ...c, active: false } : c),
    selectedClient: state.selectedClient?.id === id
      ? { ...state.selectedClient, active: false }
      : state.selectedClient,
  })),

  on(ClientActions.reactivateClientSuccess, (state, { id }) => ({
    ...state,
    clients: state.clients.map((c) => c.id === id ? { ...c, active: true } : c),
    selectedClient: state.selectedClient?.id === id
      ? { ...state.selectedClient, active: true }
      : state.selectedClient,
  })),

  on(ClientActions.deleteClientSuccess, (state, { id }) => ({
    ...state,
    clients: state.clients.filter(c => c.id !== id),
    totalElements: state.totalElements - 1,
    selectedClient: null,
  })),
  on(ClientActions.deleteClientFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);
