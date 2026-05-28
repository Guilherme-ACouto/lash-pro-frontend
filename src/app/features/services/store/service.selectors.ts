import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ServiceState } from '../../../core/models/service.model';

const selectServicesState = createFeatureSelector<ServiceState>('services');

export const selectAllServices = createSelector(selectServicesState, s => s.services);
export const selectServicesTotalElements = createSelector(selectServicesState, s => s.totalElements);
export const selectServicesCurrentPage = createSelector(selectServicesState, s => s.currentPage);
export const selectServicesPageSize = createSelector(selectServicesState, s => s.pageSize);
export const selectServicesSearch = createSelector(selectServicesState, s => s.search);
export const selectSelectedService = createSelector(selectServicesState, s => s.selectedService);
export const selectServicesLoading = createSelector(selectServicesState, s => s.isLoading);
export const selectServicesSaving = createSelector(selectServicesState, s => s.isSaving);
export const selectServicesError = createSelector(selectServicesState, s => s.error);
