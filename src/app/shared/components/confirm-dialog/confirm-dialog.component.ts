import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type ConfirmDialogVariant = 'danger' | 'primary';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent, boolean>);
  data: ConfirmDialogData = inject(MAT_DIALOG_DATA);

  get variant(): ConfirmDialogVariant {
    return this.data.variant ?? 'danger';
  }

  get icon(): string {
    return this.data.icon ?? (this.variant === 'danger' ? 'delete_outline' : 'help_outline');
  }

  close(confirmed: boolean): void {
    this.dialogRef.close(confirmed);
  }
}
