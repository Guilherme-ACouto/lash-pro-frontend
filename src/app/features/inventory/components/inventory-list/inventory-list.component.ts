import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InventoryItem } from '../../models/inventory.model';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.css',
})
export class InventoryListComponent {
  @Input() items: InventoryItem[] = [];
  @Input() totalItems = 0;
  @Input() isLoading = false;
  @Input() currentPage = 0;
  @Input() pageSize = 20;

  @Output() purchaseClick = new EventEmitter<InventoryItem>();
  @Output() exitClick = new EventEmitter<InventoryItem>();
  @Output() editClick = new EventEmitter<InventoryItem>();
  @Output() deactivateClick = new EventEmitter<InventoryItem>();
  @Output() deleteClick = new EventEmitter<InventoryItem>();
  @Output() pageChange = new EventEmitter<PageEvent>();

  getRangeLabel(): string {
    if (this.totalItems === 0) return '0 registros';
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.totalItems);
    return `Mostrando ${start} a ${end} de ${this.totalItems} registros`;
  }

  unitLabel(unit: string): string {
    const map: Record<string, string> = {
      un: 'un',
      ml: 'ml',
      g: 'g',
      cm: 'cm',
      par: 'par',
    };
    return map[unit] ?? unit;
  }
}
