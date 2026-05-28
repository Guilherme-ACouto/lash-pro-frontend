import { createAction, props } from '@ngrx/store';
import {
  CreateFinancialEntryRequest,
  FinancialEntry,
  FinancialPeriod,
  FinancialSummary,
  FinancialTab,
  UpdateFinancialEntryRequest,
} from '../models/financial.model';

export const loadSummary = createAction('[Financial] Load Summary');
export const loadSummarySuccess = createAction(
  '[Financial] Load Summary Success',
  props<{ summary: FinancialSummary }>(),
);
export const loadSummaryFailure = createAction(
  '[Financial] Load Summary Failure',
  props<{ error: string }>(),
);

export const loadEntries = createAction('[Financial] Load Entries');
export const loadEntriesSuccess = createAction(
  '[Financial] Load Entries Success',
  props<{ entries: FinancialEntry[]; totalEntries: number }>(),
);
export const loadEntriesFailure = createAction(
  '[Financial] Load Entries Failure',
  props<{ error: string }>(),
);

export const setTab = createAction('[Financial] Set Tab', props<{ tab: FinancialTab }>());
export const setPeriod = createAction('[Financial] Set Period', props<{ period: FinancialPeriod }>());
export const setCustomDates = createAction(
  '[Financial] Set Custom Dates',
  props<{ from: string; to: string }>(),
);
export const setCategory = createAction(
  '[Financial] Set Category',
  props<{ category: string | null }>(),
);

export const togglePaid = createAction('[Financial] Toggle Paid', props<{ id: string }>());
export const togglePaidSuccess = createAction(
  '[Financial] Toggle Paid Success',
  props<{ entry: FinancialEntry }>(),
);
export const togglePaidFailure = createAction(
  '[Financial] Toggle Paid Failure',
  props<{ error: string }>(),
);

export const createEntry = createAction(
  '[Financial] Create Entry',
  props<{ request: CreateFinancialEntryRequest }>(),
);
export const createEntrySuccess = createAction('[Financial] Create Entry Success');
export const createEntryFailure = createAction(
  '[Financial] Create Entry Failure',
  props<{ error: string }>(),
);

export const updateEntry = createAction(
  '[Financial] Update Entry',
  props<{ id: string; request: UpdateFinancialEntryRequest }>(),
);
export const updateEntrySuccess = createAction('[Financial] Update Entry Success');
export const updateEntryFailure = createAction(
  '[Financial] Update Entry Failure',
  props<{ error: string }>(),
);

export const deleteEntry = createAction('[Financial] Delete Entry', props<{ id: string }>());
export const deleteEntrySuccess = createAction('[Financial] Delete Entry Success');
export const deleteEntryFailure = createAction(
  '[Financial] Delete Entry Failure',
  props<{ error: string }>(),
);

export const loadCategories = createAction('[Financial] Load Categories');
export const loadCategoriesSuccess = createAction(
  '[Financial] Load Categories Success',
  props<{ categories: string[] }>(),
);
export const loadCategoriesFailure = createAction(
  '[Financial] Load Categories Failure',
  props<{ error: string }>(),
);
