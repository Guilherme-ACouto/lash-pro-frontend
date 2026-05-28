import { createReducer, on } from '@ngrx/store';
import { FinancialEntry, FinancialPeriod, FinancialSummary, FinancialTab } from '../models/financial.model';
import * as FinancialActions from './financial.actions';

export interface FinancialState {
  summary: FinancialSummary | null;
  entries: FinancialEntry[];
  totalEntries: number;
  allCategories: string[];
  activeTab: FinancialTab;
  period: FinancialPeriod;
  customFrom: string | null;
  customTo: string | null;
  category: string | null;
  page: number;
  isLoadingSummary: boolean;
  isLoadingEntries: boolean;
  error: string | null;
}

const initialState: FinancialState = {
  summary: null,
  entries: [],
  totalEntries: 0,
  allCategories: [],
  activeTab: 'INCOME',
  period: 'THIS_MONTH',
  customFrom: null,
  customTo: null,
  category: null,
  page: 0,
  isLoadingSummary: false,
  isLoadingEntries: false,
  error: null,
};

export const financialReducer = createReducer(
  initialState,

  on(FinancialActions.loadSummary, (state) => ({ ...state, isLoadingSummary: true, error: null })),
  on(FinancialActions.loadSummarySuccess, (state, { summary }) => ({
    ...state,
    summary,
    isLoadingSummary: false,
  })),
  on(FinancialActions.loadSummaryFailure, (state, { error }) => ({
    ...state,
    isLoadingSummary: false,
    error,
  })),

  on(FinancialActions.loadEntries, (state) => ({ ...state, isLoadingEntries: true, error: null })),
  on(FinancialActions.loadEntriesSuccess, (state, { entries, totalEntries }) => ({
    ...state,
    entries,
    totalEntries,
    isLoadingEntries: false,
  })),
  on(FinancialActions.loadEntriesFailure, (state, { error }) => ({
    ...state,
    isLoadingEntries: false,
    error,
  })),

  on(FinancialActions.setTab, (state, { tab }) => ({
    ...state,
    activeTab: tab,
    page: 0,
  })),
  on(FinancialActions.setPeriod, (state, { period }) => ({
    ...state,
    period,
    page: 0,
  })),
  on(FinancialActions.setCustomDates, (state, { from, to }) => ({
    ...state,
    customFrom: from,
    customTo: to,
    page: 0,
  })),
  on(FinancialActions.setCategory, (state, { category }) => ({
    ...state,
    category,
    page: 0,
  })),

  on(FinancialActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    allCategories: categories,
  })),
);
