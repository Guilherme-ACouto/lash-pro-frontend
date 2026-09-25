import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';

import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private dialog = inject(MatDialog);

  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog
      .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
        data,
        width: '420px',
        maxWidth: '95vw',
        autoFocus: false,
        panelClass: 'confirm-dialog-panel',
      })
      .afterClosed()
      .pipe(map(confirmed => !!confirmed));
  }
}
