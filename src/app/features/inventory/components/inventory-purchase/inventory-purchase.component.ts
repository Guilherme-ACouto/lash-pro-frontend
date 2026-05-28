import { Component, Inject, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { InventoryItem } from '../../models/inventory.model';
import { InventoryActions } from '../../store/inventory.actions';

export interface InventoryPurchaseData {
  item: InventoryItem;
}

@Component({
  selector: 'app-inventory-purchase',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
  ],
  templateUrl: './inventory-purchase.component.html',
  styleUrl: './inventory-purchase.component.css',
})
export class InventoryPurchaseDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<InventoryPurchaseDialogComponent>);

  readonly item: InventoryItem;

  form = this.fb.group({
    quantity: [null as number | null, [Validators.required, Validators.min(0.001)]],
    unitCost: [null as number | null, [Validators.required, Validators.min(0.01)]],
    supplier: [''],
    purchaseDate: [new Date(), Validators.required],
    paymentType: ['CASH', Validators.required],
    dueDate: [null as Date | null],
    notes: [''],
  });

  constructor(@Inject(MAT_DIALOG_DATA) data: InventoryPurchaseData) {
    this.item = data.item;
  }

  ngOnInit(): void {
    this.form.patchValue({
      unitCost: this.item.costPrice,
      supplier: this.item.supplier ?? '',
    });
  }

  get isInvoice(): boolean {
    return this.form.get('paymentType')?.value === 'INVOICE';
  }

  get total(): number {
    const qty = this.form.get('quantity')?.value ?? 0;
    const cost = this.form.get('unitCost')?.value ?? 0;
    return (qty as number) * (cost as number);
  }

  toIsoDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSave(): void {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    this.store.dispatch(
      InventoryActions.registerPurchase({
        id: this.item.id,
        request: {
          quantity: v.quantity!,
          unitCost: v.unitCost!,
          supplier: v.supplier || undefined,
          purchaseDate: this.toIsoDate(v.purchaseDate),
          paymentType: v.paymentType as any,
          dueDate: this.isInvoice && v.dueDate ? this.toIsoDate(v.dueDate) : undefined,
          notes: v.notes || undefined,
        },
      })
    );

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
