import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InventoryState } from './inventory.reducer';

export const selectInventoryState = createFeatureSelector<InventoryState>('inventory');

export const selectItems = createSelector(selectInventoryState, (s) => s.items);
export const selectTotalItems = createSelector(selectInventoryState, (s) => s.totalItems);
export const selectIsLoading = createSelector(selectInventoryState, (s) => s.isLoading);
export const selectSearch = createSelector(selectInventoryState, (s) => s.search);
export const selectStatusFilter = createSelector(selectInventoryState, (s) => s.statusFilter);
export const selectLowStockOnly = createSelector(selectInventoryState, (s) => s.lowStockOnly);
export const selectPage = createSelector(selectInventoryState, (s) => s.page);
export const selectInventoryError = createSelector(selectInventoryState, (s) => s.error);

export const selectLowStockCount = createSelector(
  selectItems,
  (items) => items.filter((i) => i.belowMinimum || i.outOfStock).length
);
