import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { InventoryFormComponent, InventoryFormData } from './components/inventory-form/inventory-form.component';
import { InventoryPurchaseDialogComponent, InventoryPurchaseData } from './components/inventory-purchase/inventory-purchase.component';
import { InventoryExitDialogComponent, InventoryExitData } from './components/inventory-exit/inventory-exit.component';
import { InventoryActions } from './store/inventory.actions';
import {
  selectItems,
  selectTotalItems,
  selectIsLoading,
  selectLowStockCount,
  selectSearch,
  selectStatusFilter,
  selectLowStockOnly,
  selectPage,
} from './store/inventory.selectors';
import { InventoryItem, InventoryStatusFilter } from './models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    InventoryListComponent,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  items$ = this.store.select(selectItems);
  totalItems$ = this.store.select(selectTotalItems);
  isLoading$ = this.store.select(selectIsLoading);
  lowStockCount$ = this.store.select(selectLowStockCount);
  statusFilter$ = this.store.select(selectStatusFilter);
  lowStockOnly$ = this.store.select(selectLowStockOnly);
  page$ = this.store.select(selectPage);

  searchControl = new FormControl('');
  currentStatusFilter: InventoryStatusFilter = 'ACTIVE';
  currentLowStockOnly = false;
  currentPage = 0;
  pageSize = 20;
  totalValue = 0;
  loadingValue = false;

  ngOnInit(): void {
    this.store.dispatch(InventoryActions.loadItems());

    this.statusFilter$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((s) => (this.currentStatusFilter = s));

    this.lowStockOnly$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => (this.currentLowStockOnly = v));

    this.page$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((p) => (this.currentPage = p));

    this.totalItems$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((t) => (this.totalValue = t));

    this.isLoading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((l) => (this.loadingValue = l));

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((search) => {
        this.store.dispatch(InventoryActions.setSearch({ search: search ?? '' }));
      });
  }

  setStatusFilter(status: InventoryStatusFilter): void {
    this.store.dispatch(InventoryActions.setStatusFilter({ status }));
  }

  toggleLowStockOnly(): void {
    this.store.dispatch(InventoryActions.setLowStockOnly({ lowStockOnly: !this.currentLowStockOnly }));
  }

  filterLowStock(): void {
    this.store.dispatch(InventoryActions.setLowStockOnly({ lowStockOnly: true }));
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(InventoryActions.setPage({ page: event.pageIndex }));
  }

  openNewItemDialog(): void {
    this.dialog.open<InventoryFormComponent, InventoryFormData>(InventoryFormComponent, {
      data: { item: null },
      maxWidth: '600px',
      width: '100%',
    });
  }

  onPurchaseClick(item: InventoryItem): void {
    this.dialog.open<InventoryPurchaseDialogComponent, InventoryPurchaseData>(
      InventoryPurchaseDialogComponent,
      { data: { item }, maxWidth: '580px', width: '100%' }
    );
  }

  onEditClick(item: InventoryItem): void {
    this.dialog.open<InventoryFormComponent, InventoryFormData>(InventoryFormComponent, {
      data: { item },
      maxWidth: '600px',
      width: '100%',
    });
  }

  onDeactivateClick(item: InventoryItem): void {
    if (item.active) {
      this.store.dispatch(InventoryActions.deactivateItem({ id: item.id }));
    } else {
      this.store.dispatch(InventoryActions.reactivateItem({ id: item.id }));
    }
  }

  onDeleteClick(item: InventoryItem): void {
    if (!confirm(`Excluir "${item.name}" permanentemente? Esta ação não pode ser desfeita.`)) return;
    this.store.dispatch(InventoryActions.deleteItem({ id: item.id }));
  }

  onExitClick(item: InventoryItem): void {
    this.dialog.open<InventoryExitDialogComponent, InventoryExitData>(InventoryExitDialogComponent, {
      data: { item },
      maxWidth: '540px',
      width: '100%',
    });
  }
}
