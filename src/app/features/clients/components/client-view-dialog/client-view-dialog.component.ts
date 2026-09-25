import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Client } from '../../../../core/models/client.model';
import { DatePtbrPipe } from '../../../../shared/pipes/date-ptbr.pipe';

export interface ClientViewDialogData {
  client: Client;
}

export type ClientViewDialogResult = 'edit';

@Component({
  selector: 'app-client-view-dialog',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, DatePtbrPipe],
  templateUrl: './client-view-dialog.component.html',
  styleUrl: './client-view-dialog.component.css',
})
export class ClientViewDialogComponent {
  private dialogRef = inject(MatDialogRef<ClientViewDialogComponent, ClientViewDialogResult>);
  data: ClientViewDialogData = inject(MAT_DIALOG_DATA);

  get client(): Client {
    return this.data.client;
  }

  close(): void {
    this.dialogRef.close();
  }

  edit(): void {
    this.dialogRef.close('edit');
  }
}
