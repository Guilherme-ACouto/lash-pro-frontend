import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentSummary } from '../../../core/models/appointment-summary.model';

export interface AppointmentsWarningData {
  title: string;
  message: string;
  appointments: AppointmentSummary[];
  canForce?: boolean;
  forceLabel?: string;
}

@Component({
  selector: 'app-appointments-warning-dialog',
  standalone: true,
  imports: [RouterLink, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './appointments-warning-dialog.component.html',
  styleUrl: './appointments-warning-dialog.component.css',
})
export class AppointmentsWarningDialogComponent {
  data = inject<AppointmentsWarningData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<AppointmentsWarningDialogComponent>);

  formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  formatTime(timeStr: string): string {
    return timeStr.substring(0, 5);
  }

  close(): void {
    this.dialogRef.close(false);
  }

  force(): void {
    this.dialogRef.close(true);
  }
}
