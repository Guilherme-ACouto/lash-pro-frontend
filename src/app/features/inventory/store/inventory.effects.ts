import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, of, switchMap, withLatestFrom, mergeMap } from 'rxjs';
import { InventoryService } from '../services/inventory.service';
import { InventoryActions } from './inventory.actions';
import {
  selectSearch,
  selectStatusFilter,
  selectLowStockOnly,
  selectPage,
} from './inventory.selectors';

@Injectable()
export class InventoryEffects {
  private actions$ = inject(Actions);
  private inventoryService = inject(InventoryService);
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.loadItems),
      withLatestFrom(
        this.store.select(selectSearch),
        this.store.select(selectStatusFilter),
        this.store.select(selectLowStockOnly),
        this.store.select(selectPage)
      ),
      switchMap(([, search, statusFilter, lowStockOnly, page]) =>
        this.inventoryService.list(search, statusFilter, lowStockOnly, page, 20).pipe(
          map((response) =>
            InventoryActions.loadItemsSuccess({
              items: response.content,
              totalItems: response.totalElements,
            })
          ),
          catchError((err) =>
            of(InventoryActions.loadItemsFailure({
              error: err.error?.message ?? 'Erro ao carregar itens do estoque',
            }))
          )
        )
      )
    )
  );

  setSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.setSearch),
      map(() => InventoryActions.loadItems())
    )
  );

  setStatusFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.setStatusFilter),
      map(() => InventoryActions.loadItems())
    )
  );

  setLowStockOnly$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.setLowStockOnly),
      map(() => InventoryActions.loadItems())
    )
  );

  setPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.setPage),
      map(() => InventoryActions.loadItems())
    )
  );

  createItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.createItem),
      switchMap(({ request }) =>
        this.inventoryService.create(request).pipe(
          mergeMap((item) => [
            InventoryActions.createItemSuccess({ item }),
            InventoryActions.loadItems(),
          ]),
          catchError((err) =>
            of(InventoryActions.createItemFailure({
              error: err.error?.message ?? 'Erro ao criar item',
            }))
          )
        )
      )
    )
  );

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.updateItem),
      switchMap(({ id, request }) =>
        this.inventoryService.update(id, request).pipe(
          mergeMap((item) => [
            InventoryActions.updateItemSuccess({ item }),
            InventoryActions.loadItems(),
          ]),
          catchError((err) =>
            of(InventoryActions.updateItemFailure({
              error: err.error?.message ?? 'Erro ao atualizar item',
            }))
          )
        )
      )
    )
  );

  deleteItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.deleteItem),
      switchMap(({ id }) =>
        this.inventoryService.delete(id).pipe(
          mergeMap(() => [
            InventoryActions.deleteItemSuccess({ id }),
            InventoryActions.loadItems(),
          ]),
          catchError((err) =>
            of(InventoryActions.deleteItemFailure({
              error: err.error?.message ?? 'Erro ao excluir item',
            }))
          )
        )
      )
    )
  );

  deactivateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.deactivateItem),
      switchMap(({ id }) =>
        this.inventoryService.deactivate(id).pipe(
          mergeMap(() => [
            InventoryActions.deactivateItemSuccess({ id }),
            InventoryActions.loadItems(),
          ]),
          catchError((err) =>
            of(InventoryActions.deactivateItemFailure({
              error: err.error?.message ?? 'Erro ao desativar item',
            }))
          )
        )
      )
    )
  );

  reactivateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.reactivateItem),
      switchMap(({ id }) =>
        this.inventoryService.reactivate(id).pipe(
          mergeMap(() => [
            InventoryActions.reactivateItemSuccess({ id }),
            InventoryActions.loadItems(),
          ]),
          catchError((err) =>
            of(InventoryActions.reactivateItemFailure({
              error: err.error?.message ?? 'Erro ao reativar item',
            }))
          )
        )
      )
    )
  );

  registerPurchase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.registerPurchase),
      switchMap(({ id, request }) =>
        this.inventoryService.registerPurchase(id, request).pipe(
          mergeMap((result) => {
            this.snackBar.open(
              `${result.movement.quantity} unidades adicionadas • despesa criada no Financeiro`,
              'Fechar',
              { duration: 4000, panelClass: ['snack-success'] }
            );
            return [
              InventoryActions.registerPurchaseSuccess({ result }),
              InventoryActions.loadItems(),
            ];
          }),
          catchError((err) =>
            of(InventoryActions.registerPurchaseFailure({
              error: err.error?.message ?? 'Erro ao registrar compra',
            }))
          )
        )
      )
    )
  );

  registerExit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.registerExit),
      switchMap(({ id, request }) =>
        this.inventoryService.registerExit(id, request).pipe(
          mergeMap(() => [
            InventoryActions.registerExitSuccess(),
            InventoryActions.loadItems(),
          ]),
          catchError((err) =>
            of(InventoryActions.registerExitFailure({
              error: err.error?.message ?? 'Erro ao registrar saída',
            }))
          )
        )
      )
    )
  );
}
