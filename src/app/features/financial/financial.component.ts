import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FinancialEntry, FinancialPeriod, FinancialSummary, FinancialTab } from './models/financial.model';
import { FinancialSummaryComponent } from './components/financial-summary/financial-summary.component';
import { FinancialTransactionsComponent } from './components/financial-transactions/financial-transactions.component';
import { FinancialFormComponent } from './components/financial-form/financial-form.component';
import * as FinancialActions from './store/financial.actions';
import {
  selectAllCategories,
  selectCategory,
  selectEntries,
  selectIsLoadingEntries,
  selectIsLoadingSummary,
  selectPeriod,
  selectSummary,
  selectTotalEntries,
  selectActiveTab,
} from './store/financial.selectors';

interface PeriodOption { value: FinancialPeriod; label: string; }

@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    FinancialSummaryComponent,
    FinancialTransactionsComponent,
  ],
  templateUrl: './financial.component.html',
  styleUrl: './financial.component.css',
})
export class FinancialComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  summary$: Observable<FinancialSummary | null> = this.store.select(selectSummary);
  entries$: Observable<FinancialEntry[]> = this.store.select(selectEntries);
  totalEntries$: Observable<number> = this.store.select(selectTotalEntries);
  activeTab$: Observable<FinancialTab> = this.store.select(selectActiveTab);
  isLoadingSummary$: Observable<boolean> = this.store.select(selectIsLoadingSummary);
  isLoadingEntries$: Observable<boolean> = this.store.select(selectIsLoadingEntries);
  period$: Observable<FinancialPeriod> = this.store.select(selectPeriod);
  category$: Observable<string | null> = this.store.select(selectCategory);
  categories$: Observable<string[]> = this.store.select(selectAllCategories);

  customFromCtrl = new FormControl<Date | null>(null);
  customToCtrl = new FormControl<Date | null>(null);

  readonly periodOptions: PeriodOption[] = [
    { value: 'THIS_MONTH', label: 'Este mês' },
    { value: 'NEXT_MONTH', label: 'Próximo mês' },
    { value: 'THIS_WEEK', label: 'Esta semana' },
    { value: 'TODAY', label: 'Hoje' },
    { value: 'LAST_30', label: 'Últimos 30 dias' },
    { value: 'LAST_90', label: 'Últimos 90 dias' },
    { value: 'THIS_YEAR', label: 'Este ano' },
    { value: 'CUSTOM', label: 'Personalizado' },
  ];

  ngOnInit(): void {
    this.store.dispatch(FinancialActions.loadSummary());
    this.store.dispatch(FinancialActions.loadEntries());
    this.store.dispatch(FinancialActions.loadCategories());
  }

  onPeriodChange(period: FinancialPeriod): void {
    this.store.dispatch(FinancialActions.setPeriod({ period }));
  }

  onCustomDateChange(): void {
    const from = this.customFromCtrl.value;
    const to = this.customToCtrl.value;
    if (from && to) {
      const fmt = (d: Date) => d.toISOString().split('T')[0];
      this.store.dispatch(FinancialActions.setCustomDates({ from: fmt(from), to: fmt(to) }));
    }
  }

  onCategoryChange(category: string | null): void {
    this.store.dispatch(FinancialActions.setCategory({ category }));
  }

  onTabChange(tab: FinancialTab): void {
    this.store.dispatch(FinancialActions.setTab({ tab }));
  }

  onTogglePaid(id: string): void {
    this.store.dispatch(FinancialActions.togglePaid({ id }));
  }

  onEditEntry(entry: FinancialEntry): void {
    this.dialog.open(FinancialFormComponent, {
      data: { entry },
      width: '560px',
      maxWidth: '95vw',
    });
  }

  onDeleteEntry(id: string): void {
    const ref = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { message: 'Deseja excluir este lançamento?' },
      width: '360px',
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(FinancialActions.deleteEntry({ id }));
      }
    });
  }

  onNewTransaction(): void {
    this.dialog.open(FinancialFormComponent, {
      data: { entry: null },
      width: '560px',
      maxWidth: '95vw',
    });
  }
}

// Dialog de confirmação inline (simples, sem componente dedicado)
import { Component as NgComponent, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@NgComponent({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Confirmar exclusão</h2>
    <mat-dialog-content><p>{{ data.message }}</p></mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-flat-button color="warn" (click)="dialogRef.close(true)">Excluir</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
  ) {}
}
