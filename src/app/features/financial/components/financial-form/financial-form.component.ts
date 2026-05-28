import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { Store } from '@ngrx/store';
import { FinancialEntry } from '../../models/financial.model';
import * as FinancialActions from '../../store/financial.actions';

export interface FinancialFormData {
  entry: FinancialEntry | null;
}

@Component({
  selector: 'app-financial-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatRadioModule,
  ],
  templateUrl: './financial-form.component.html',
  styleUrl: './financial-form.component.css',
})
export class FinancialFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<FinancialFormComponent>);

  readonly entry: FinancialEntry | null;
  readonly isEdit: boolean;
  readonly isLinked: boolean;
  readonly isIncomePaid: boolean;

  readonly expenseTypes = [
    { value: 'FIXED', label: 'Despesa fixa' },
    { value: 'VARIABLE', label: 'Despesa variável' },
    { value: 'PEOPLE', label: 'Pessoas' },
    { value: 'TAX', label: 'Imposto' },
    { value: 'TRANSFER', label: 'Transferência' },
  ];

  readonly paymentMethods = ['PIX', 'Dinheiro', 'Cartão Débito', 'Cartão Crédito', 'Transferência', 'Outros'];

  readonly incomeCategories = ['Serviço', 'Venda de produto', 'Gorjeta', 'Outros recebimentos'];
  readonly expenseCategories = ['Aluguel', 'Internet', 'Telefone', 'Software/Assinatura', 'Material de consumo', 'Equipamentos', 'Marketing', 'Salário', 'Comissão', 'Pró-labore', 'Imposto', 'Simples Nacional', 'Outros'];

  form = this.fb.group({
    type: ['INCOME', Validators.required],
    expenseType: [''],
    description: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    dueDate: [null as Date | null, Validators.required],
    category: [''],
    paymentMethod: [''],
    receivedFrom: [''],
    paymentDate: [null as Date | null],
    notes: [''],
  });

  constructor(@Inject(MAT_DIALOG_DATA) data: FinancialFormData) {
    this.entry = data.entry;
    this.isEdit = !!data.entry;
    this.isLinked = data.entry?.linkedToAppointment ?? false;
    this.isIncomePaid = data.entry?.type === 'INCOME' && data.entry?.status === 'PAID';
  }

  ngOnInit(): void {
    if (this.entry) {
      this.form.patchValue({
        type: this.entry.type,
        expenseType: this.entry.expenseType ?? '',
        description: this.entry.description,
        amount: this.entry.amount,
        dueDate: this.entry.dueDate ? new Date(this.entry.dueDate) : null,
        category: this.entry.category ?? '',
        paymentMethod: this.entry.paymentMethod ?? '',
        receivedFrom: this.entry.counterpart ?? '',
        paymentDate: this.entry.paymentDate ? new Date(this.entry.paymentDate) : null,
        notes: this.entry.notes ?? '',
      });
      this.form.get('type')?.disable();
    }

    if (this.isIncomePaid) {
      this.form.disable();
      return;
    }

    if (this.isLinked) {
      const editable = ['paymentMethod', 'paymentDate', 'notes'];
      Object.keys(this.form.controls).forEach((key) => {
        if (!editable.includes(key)) {
          this.form.get(key)?.disable();
        }
      });
    }
  }

  get isExpense(): boolean {
    return this.form.get('type')?.value === 'EXPENSE';
  }

  get title(): string {
    if (!this.isEdit) return 'Nova transação';
    if (this.isIncomePaid) return 'Receita recebida';
    return this.isLinked ? 'Lançamento do agendamento' : 'Editar lançamento';
  }

  toIsoDate(date: Date | null): string | null {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  }

  onSave(): void {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    if (this.isEdit && this.entry) {
      this.store.dispatch(
        FinancialActions.updateEntry({
          id: this.entry.id,
          request: {
            description: v.description ?? undefined,
            amount: v.amount ?? undefined,
            dueDate: this.toIsoDate(v.dueDate) ?? undefined,
            paymentDate: this.toIsoDate(v.paymentDate),
            category: v.category || null,
            expenseType: (v.expenseType as any) || null,
            paymentMethod: v.paymentMethod || null,
            receivedFrom: v.receivedFrom || null,
            notes: v.notes || null,
          },
        }),
      );
    } else {
      this.store.dispatch(
        FinancialActions.createEntry({
          request: {
            type: v.type as any,
            expenseType: (v.expenseType as any) || undefined,
            description: v.description!,
            amount: v.amount!,
            dueDate: this.toIsoDate(v.dueDate)!,
            paymentDate: this.toIsoDate(v.paymentDate),
            category: v.category || null,
            paymentMethod: v.paymentMethod || null,
            receivedFrom: v.receivedFrom || null,
            notes: v.notes || null,
          },
        }),
      );
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
