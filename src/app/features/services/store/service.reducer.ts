import { createReducer, on } from '@ngrx/store';
import { ServiceState } from '../../../core/models/service.model';
import { ServiceActions } from './service.actions';

const initialState: ServiceState = {
  services: [],
  totalElements: 0,
  currentPage: 0,
  pageSize: 20,
  search: '',
  selectedService: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export const serviceReducer = createReducer(
  initialState,

  on(ServiceActions.loadServices, (state, { search, page }) => ({
    ...state,
    isLoading: true,
    error: null,
    search: search ?? state.search,
    currentPage: page ?? 0,
  })),
  on(ServiceActions.loadServicesSuccess, (state, { services, totalElements, page }) => ({
    ...state,
    isLoading: false,
    services,
    totalElements,
    currentPage: page,
  })),
  on(ServiceActions.loadServicesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(ServiceActions.selectService, (state) => ({ ...state, isLoading: true, error: null })),
  on(ServiceActions.selectServiceSuccess, (state, { service }) => ({
    ...state,
    isLoading: false,
    selectedService: service,
  })),
  on(ServiceActions.selectServiceFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(ServiceActions.clearSelectedService, (state) => ({ ...state, selectedService: null })),

  on(ServiceActions.createService, (state) => ({ ...state, isSaving: true, error: null })),
  on(ServiceActions.createServiceSuccess, (state, { service }) => ({
    ...state,
    isSaving: false,
    services: [service, ...state.services],
    totalElements: state.totalElements + 1,
  })),
  on(ServiceActions.createServiceFailure, (state, { error }) => ({
    ...state,
    isSaving: false,
    error,
  })),

  on(ServiceActions.updateService, (state) => ({ ...state, isSaving: true, error: null })),
  on(ServiceActions.updateServiceSuccess, (state, { service }) => ({
    ...state,
    isSaving: false,
    selectedService: service,
    services: state.services.map(s => s.id === service.id ? service : s),
  })),
  on(ServiceActions.updateServiceFailure, (state, { error }) => ({
    ...state,
    isSaving: false,
    error,
  })),

  on(ServiceActions.deactivateServiceSuccess, (state, { id }) => ({
    ...state,
    services: state.services.map(s => s.id === id ? { ...s, active: false } : s),
    selectedService: state.selectedService?.id === id
      ? { ...state.selectedService, active: false }
      : state.selectedService,
  })),

  on(ServiceActions.reactivateServiceSuccess, (state, { id }) => ({
    ...state,
    services: state.services.map(s => s.id === id ? { ...s, active: true } : s),
    selectedService: state.selectedService?.id === id
      ? { ...state.selectedService, active: true }
      : state.selectedService,
  })),

  on(ServiceActions.deleteServiceSuccess, (state, { id }) => ({
    ...state,
    services: state.services.filter(s => s.id !== id),
    totalElements: state.totalElements - 1,
    selectedService: null,
  })),
  on(ServiceActions.deleteServiceFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);
