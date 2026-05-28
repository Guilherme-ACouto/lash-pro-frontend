import { createAction, props } from '@ngrx/store';
import {
  InventoryItem,
  InventoryStatusFilter,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  RegisterPurchaseRequest,
  RegisterManualExitRequest,
  RegisterPurchaseResult,
} from '../models/inventory.model';

export const InventoryActions = {
  // Carregar itens
  loadItems: createAction('[Inventory] Load Items'),
  loadItemsSuccess: createAction(
    '[Inventory] Load Items Success',
    props<{ items: InventoryItem[]; totalItems: number }>()
  ),
  loadItemsFailure: createAction(
    '[Inventory] Load Items Failure',
    props<{ error: string }>()
  ),

  // Criar item
  createItem: createAction(
    '[Inventory] Create Item',
    props<{ request: CreateInventoryItemRequest }>()
  ),
  createItemSuccess: createAction(
    '[Inventory] Create Item Success',
    props<{ item: InventoryItem }>()
  ),
  createItemFailure: createAction(
    '[Inventory] Create Item Failure',
    props<{ error: string }>()
  ),

  // Atualizar item
  updateItem: createAction(
    '[Inventory] Update Item',
    props<{ id: string; request: UpdateInventoryItemRequest }>()
  ),
  updateItemSuccess: createAction(
    '[Inventory] Update Item Success',
    props<{ item: InventoryItem }>()
  ),
  updateItemFailure: createAction(
    '[Inventory] Update Item Failure',
    props<{ error: string }>()
  ),

  // Excluir item
  deleteItem: createAction('[Inventory] Delete Item', props<{ id: string }>()),
  deleteItemSuccess: createAction('[Inventory] Delete Item Success', props<{ id: string }>()),
  deleteItemFailure: createAction('[Inventory] Delete Item Failure', props<{ error: string }>()),

  // Desativar item
  deactivateItem: createAction('[Inventory] Deactivate Item', props<{ id: string }>()),
  deactivateItemSuccess: createAction('[Inventory] Deactivate Item Success', props<{ id: string }>()),
  deactivateItemFailure: createAction('[Inventory] Deactivate Item Failure', props<{ error: string }>()),

  // Reativar item
  reactivateItem: createAction('[Inventory] Reactivate Item', props<{ id: string }>()),
  reactivateItemSuccess: createAction('[Inventory] Reactivate Item Success', props<{ id: string }>()),
  reactivateItemFailure: createAction('[Inventory] Reactivate Item Failure', props<{ error: string }>()),

  // Registrar compra
  registerPurchase: createAction(
    '[Inventory] Register Purchase',
    props<{ id: string; request: RegisterPurchaseRequest }>()
  ),
  registerPurchaseSuccess: createAction(
    '[Inventory] Register Purchase Success',
    props<{ result: RegisterPurchaseResult }>()
  ),
  registerPurchaseFailure: createAction(
    '[Inventory] Register Purchase Failure',
    props<{ error: string }>()
  ),

  // Registrar saída
  registerExit: createAction(
    '[Inventory] Register Exit',
    props<{ id: string; request: RegisterManualExitRequest }>()
  ),
  registerExitSuccess: createAction('[Inventory] Register Exit Success'),
  registerExitFailure: createAction(
    '[Inventory] Register Exit Failure',
    props<{ error: string }>()
  ),

  // Paginação
  setPage: createAction('[Inventory] Set Page', props<{ page: number }>()),

  // Filtros
  setSearch: createAction('[Inventory] Set Search', props<{ search: string }>()),
  setStatusFilter: createAction(
    '[Inventory] Set Status Filter',
    props<{ status: InventoryStatusFilter }>()
  ),
  setLowStockOnly: createAction(
    '[Inventory] Set Low Stock Only',
    props<{ lowStockOnly: boolean }>()
  ),
};
