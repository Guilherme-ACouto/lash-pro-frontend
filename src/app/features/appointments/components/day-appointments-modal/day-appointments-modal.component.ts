import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Appointment } from '../../../../core/models/appointment.model';
import { AppointmentPopupComponent } from '../appointment-popup/appointment-popup.component';

export interface DayAppointmentsModalData {
  date: string;
  appointments: Appointment[];
}

@Component({
  selector: 'app-day-appointments-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './day-appointments-modal.component.html',
  styleUrl: './day-appointments-modal.component.css'
})
export class DayAppointmentsModalComponent {
  dialogRef = inject(MatDialogRef<DayAppointmentsModalComponent>);
  data: DayAppointmentsModalData = inject(MAT_DIALOG_DATA);
  private dialog = inject(MatDialog);

  getDayHeader(): { dayName: string; dayNumber: number } {
    const d = new Date(this.data.date + 'T12:00:00');
    return {
      dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase(),
      dayNumber: d.getDate(),
    };
  }

  openAppointment(appt: Appointment): void {
    this.dialogRef.close();
    this.dialog.open(AppointmentPopupComponent, {
      data: { appointment: appt },
      width: '380px',
      panelClass: 'appt-popup-panel',
    });
  }
}
