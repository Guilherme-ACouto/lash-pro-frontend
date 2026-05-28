import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FinancialEntry, FinancialTab } from '../../models/financial.model';
import { CurrencyBrPipe } from '../../../../shared/pipes/currency-br.pipe';
import { DatePtbrPipe } from '../../../../shared/pipes/date-ptbr.pipe';

interface TabDefinition {
  label: string;
  value: FinancialTab;
}

@Component({
  selector: 'app-financial-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    CurrencyBrPipe,
    DatePtbrPipe,
  ],
  templateUrl: './financial-transactions.component.html',
  styleUrl: './financial-transactions.component.css',
})
export class FinancialTransactionsComponent implements OnInit {
  @Input() entries: FinancialEntry[] = [];
  @Input() totalEntries = 0;
  @Input() activeTab: FinancialTab = 'INCOME';
  @Input() isLoading = false;

  @Output() tabChange = new EventEmitter<FinancialTab>();
  @Output() togglePaid = new EventEmitter<string>();
  @Output() editEntry = new EventEmitter<FinancialEntry>();
  @Output() deleteEntry = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();

  readonly tabs: TabDefinition[] = [
    { label: 'Recebimentos', value: 'INCOME' },
    { label: 'Despesas fixas', value: 'FIXED' },
    { label: 'Despesas variáveis', value: 'VARIABLE' },
    { label: 'Pessoas', value: 'PEOPLE' },
    { label: 'Impostos', value: 'TAX' },
    { label: 'Transferências', value: 'TRANSFER' },
  ];

  private readonly allColumns = ['dueDate', 'description', 'counterpart', 'category', 'amount', 'paymentMethod', 'status', 'actions'];
  private readonly mobileColumns = ['dueDate', 'description', 'amount', 'status', 'actions'];
  displayedColumns = this.allColumns;

  ngOnInit(): void {
    this.updateColumns();
  }

  @HostListener('window:resize')
  updateColumns(): void {
    this.displayedColumns = window.innerWidth <= 600 ? this.mobileColumns : this.allColumns;
  }

  get activeTabIndex(): number {
    return this.tabs.findIndex((t) => t.value === this.activeTab);
  }

  onTabChange(index: number): void {
    this.tabChange.emit(this.tabs[index].value);
  }

  onRowClick(entry: FinancialEntry): void {
    this.editEntry.emit(entry);
  }

  onTogglePaid(event: Event, id: string): void {
    event.stopPropagation();
    this.togglePaid.emit(id);
  }

  onDelete(event: Event, id: string): void {
    event.stopPropagation();
    this.deleteEntry.emit(id);
  }

  onPage(event: PageEvent): void {
    this.pageChange.emit(event.pageIndex);
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'PAID': return 'Pago';
      case 'PENDING': return 'Pendente';
      case 'OVERDUE': return 'Vencido';
      default: return status;
    }
  }

  isToggleable(entry: FinancialEntry): boolean {
    if (entry.status === 'OVERDUE') return false;
    if (entry.type === 'INCOME' && entry.status === 'PAID') return false;
    return true;
  }
}
