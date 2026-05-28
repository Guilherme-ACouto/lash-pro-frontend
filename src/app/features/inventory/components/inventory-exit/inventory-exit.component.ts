import { Component, Inject, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { InventoryItem } from '../../models/inventory.model';
import { InventoryActions } from '../../store/inventory.actions';

export interface InventoryExitData {
  item: InventoryItem;
}

@Component({
  selector: 'app-inventory-exit',
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
  ],
  templateUrl: './inventory-exit.component.html',
  styleUrl: './inventory-exit.component.css',
})
export class InventoryExitDialogComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<InventoryExitDialogComponent>);

  readonly item: InventoryItem;

  readonly reasons = [
    { value: 'USAGE', label: 'Uso' },
    { value: 'LOSS', label: 'Perda' },
    { value: 'ADJUSTMENT', label: 'Ajuste' },
    { value: 'OTHER', label: 'Outro' },
  ];

  form = this.fb.group({
    quantity: [null as number | null, [Validators.required, Validators.min(0.001)]],
    reason: ['USAGE', Validators.required],
    notes: [''],
    exitDate: [new Date(), Validators.required],
  });

  constructor(@Inject(MAT_DIALOG_DATA) data: InventoryExitData) {
    this.item = data.item;
  }

  get willGoNegative(): boolean {
    const qty = this.form.get('quantity')?.value ?? 0;
    return (qty as number) > this.item.currentQuantity;
  }

  toIsoDate(date: Date | null): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  onSave(): void {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    this.store.dispatch(
      InventoryActions.registerExit({
        id: this.item.id,
        request: {
          quantity: v.quantity!,
          reason: v.reason as any,
          notes: v.notes || undefined,
          exitDate: this.toIsoDate(v.exitDate),
        },
      })
    );

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
