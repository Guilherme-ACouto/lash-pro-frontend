import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FichasState } from './fichas.reducer';

export const selectFichasState = createFeatureSelector<FichasState>('fichas');

export const selectAnamneseSummaries = createSelector(selectFichasState, s => s.anamneseSummaries);
export const selectTotalAnamneses = createSelector(selectFichasState, s => s.totalAnamneses);
export const selectCurrentAnamnese = createSelector(selectFichasState, s => s.currentAnamnese);
export const selectGeneratedLink = createSelector(selectFichasState, s => s.generatedLink);

export const selectMappingSummaries = createSelector(selectFichasState, s => s.mappingSummaries);
export const selectTotalMappings = createSelector(selectFichasState, s => s.totalMappings);
export const selectClientMappings = createSelector(selectFichasState, s => s.clientMappings);
export const selectTotalClientMappings = createSelector(selectFichasState, s => s.totalClientMappings);
export const selectCurrentMapping = createSelector(selectFichasState, s => s.currentMapping);

export const selectFichasIsLoading = createSelector(selectFichasState, s => s.isLoading);
export const selectFichasSearch = createSelector(selectFichasState, s => s.search);
export const selectFichasPage = createSelector(selectFichasState, s => s.page);
export const selectFichasError = createSelector(selectFichasState, s => s.error);
