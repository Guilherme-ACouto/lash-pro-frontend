import { Component, Inject, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { InventoryItem } from '../../models/inventory.model';
import { InventoryActions } from '../../store/inventory.actions';

export interface InventoryFormData {
  item: InventoryItem | null;
}

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './inventory-form.component.html',
  styleUrl: './inventory-form.component.css',
})
export class InventoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<InventoryFormComponent>);

  readonly item: InventoryItem | null;
  readonly isEdit: boolean;

  readonly units = [
    { value: 'un', label: 'Unidade (un)' },
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'g', label: 'Gramas (g)' },
    { value: 'cm', label: 'Centímetros (cm)' },
    { value: 'par', label: 'Par' },
  ];

  form = this.fb.group({
    name: ['', Validators.required],
    internalCode: [''],
    unit: ['un', Validators.required],
    costPrice: [null as number | null, [Validators.required, Validators.min(0.01)]],
    supplier: [''],
    currentQuantity: [0, [Validators.required, Validators.min(0)]],
    minimumQuantity: [0, [Validators.required, Validators.min(0)]],
    notes: [''],
  });

  constructor(@Inject(MAT_DIALOG_DATA) data: InventoryFormData) {
    this.item = data.item;
    this.isEdit = !!data.item;
  }

  ngOnInit(): void {
    if (this.item) {
      this.form.patchValue({
        name: this.item.name,
        internalCode: this.item.internalCode ?? '',
        unit: this.item.unit,
        costPrice: this.item.costPrice,
        supplier: this.item.supplier ?? '',
        currentQuantity: this.item.currentQuantity,
        minimumQuantity: this.item.minimumQuantity,
        notes: this.item.notes ?? '',
      });
      this.form.get('currentQuantity')?.disable();
    }
  }

  get title(): string {
    return this.isEdit ? 'Editar item' : 'Novo item';
  }

  onSave(): void {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    if (this.isEdit && this.item) {
      this.store.dispatch(
        InventoryActions.updateItem({
          id: this.item.id,
          request: {
            name: v.name!,
            unit: v.unit as any,
            costPrice: v.costPrice!,
            supplier: v.supplier || undefined,
            minimumQuantity: v.minimumQuantity!,
            notes: v.notes || undefined,
          },
        })
      );
    } else {
      this.store.dispatch(
        InventoryActions.createItem({
          request: {
            name: v.name!,
            internalCode: v.internalCode || undefined,
            unit: v.unit as any,
            costPrice: v.costPrice!,
            supplier: v.supplier || undefined,
            currentQuantity: v.currentQuantity!,
            minimumQuantity: v.minimumQuantity!,
            notes: v.notes || undefined,
          },
        })
      );
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
