import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FinancialState } from './financial.reducer';

export const selectFinancialState = createFeatureSelector<FinancialState>('financial');

export const selectSummary = createSelector(selectFinancialState, (s) => s.summary);
export const selectEntries = createSelector(selectFinancialState, (s) => s.entries);
export const selectTotalEntries = createSelector(selectFinancialState, (s) => s.totalEntries);
export const selectActiveTab = createSelector(selectFinancialState, (s) => s.activeTab);
export const selectPeriod = createSelector(selectFinancialState, (s) => s.period);
export const selectCustomFrom = createSelector(selectFinancialState, (s) => s.customFrom);
export const selectCustomTo = createSelector(selectFinancialState, (s) => s.customTo);
export const selectCategory = createSelector(selectFinancialState, (s) => s.category);
export const selectPage = createSelector(selectFinancialState, (s) => s.page);
export const selectIsLoadingSummary = createSelector(selectFinancialState, (s) => s.isLoadingSummary);
export const selectIsLoadingEntries = createSelector(selectFinancialState, (s) => s.isLoadingEntries);
export const selectError = createSelector(selectFinancialState, (s) => s.error);

export const selectAllCategories = createSelector(selectFinancialState, (s) => s.allCategories);

export const selectDistinctCategories = createSelector(selectEntries, (entries) => {
  const cats = entries.map((e) => e.category).filter((c): c is string => !!c);
  return [...new Set(cats)].sort();
});
