import { createReducer, on } from '@ngrx/store';
import { InventoryItem, InventoryStatusFilter } from '../models/inventory.model';
import { InventoryActions } from './inventory.actions';

export interface InventoryState {
  items: InventoryItem[];
  totalItems: number;
  search: string;
  statusFilter: InventoryStatusFilter;
  lowStockOnly: boolean;
  page: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  totalItems: 0,
  search: '',
  statusFilter: 'ACTIVE',
  lowStockOnly: false,
  page: 0,
  isLoading: false,
  error: null,
};

export const inventoryReducer = createReducer(
  initialState,

  on(InventoryActions.loadItems, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(InventoryActions.loadItemsSuccess, (state, { items, totalItems }) => ({
    ...state,
    isLoading: false,
    items,
    totalItems,
  })),
  on(InventoryActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(InventoryActions.createItem, (state) => ({ ...state, isLoading: true, error: null })),
  on(InventoryActions.createItemSuccess, (state, { item }) => ({
    ...state,
    isLoading: false,
    items: [item, ...state.items],
    totalItems: state.totalItems + 1,
  })),
  on(InventoryActions.createItemFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(InventoryActions.updateItem, (state) => ({ ...state, isLoading: true, error: null })),
  on(InventoryActions.updateItemSuccess, (state, { item }) => ({
    ...state,
    isLoading: false,
    items: state.items.map((i) => (i.id === item.id ? item : i)),
  })),
  on(InventoryActions.updateItemFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(InventoryActions.deleteItemSuccess, (state, { id }) => ({
    ...state,
    items: state.items.filter((i) => i.id !== id),
    totalItems: state.totalItems - 1,
  })),
  on(InventoryActions.deleteItemFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(InventoryActions.deactivateItemSuccess, (state, { id }) => ({
    ...state,
    items: state.items.map((i) => (i.id === id ? { ...i, active: false } : i)),
  })),
  on(InventoryActions.deactivateItemFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(InventoryActions.reactivateItemSuccess, (state, { id }) => ({
    ...state,
    items: state.items.map((i) => (i.id === id ? { ...i, active: true } : i)),
  })),
  on(InventoryActions.reactivateItemFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(InventoryActions.registerPurchase, (state) => ({ ...state, isLoading: true, error: null })),
  on(InventoryActions.registerPurchaseSuccess, (state, { result }) => ({
    ...state,
    isLoading: false,
    items: state.items.map((i) => (i.id === result.item.id ? result.item : i)),
  })),
  on(InventoryActions.registerPurchaseFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(InventoryActions.registerExit, (state) => ({ ...state, isLoading: true, error: null })),
  on(InventoryActions.registerExitSuccess, (state) => ({ ...state, isLoading: false })),
  on(InventoryActions.registerExitFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(InventoryActions.setPage, (state, { page }) => ({
    ...state,
    page,
  })),

  on(InventoryActions.setSearch, (state, { search }) => ({
    ...state,
    search,
    page: 0,
  })),
  on(InventoryActions.setStatusFilter, (state, { status }) => ({
    ...state,
    statusFilter: status,
    page: 0,
  })),
  on(InventoryActions.setLowStockOnly, (state, { lowStockOnly }) => ({
    ...state,
    lowStockOnly,
    page: 0,
  })),
);
