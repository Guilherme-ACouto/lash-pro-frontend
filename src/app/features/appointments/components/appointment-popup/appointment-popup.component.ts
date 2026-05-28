import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';
import { Appointment } from '../../../../core/models/appointment.model';

export interface AppointmentPopupData {
  appointment: Appointment;
}

@Component({
  selector: 'app-appointment-popup',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatDialogModule, DurationPipe],
  templateUrl: './appointment-popup.component.html',
  styleUrl: './appointment-popup.component.css'
})
export class AppointmentPopupComponent {
  dialogRef = inject(MatDialogRef<AppointmentPopupComponent>);
  data: AppointmentPopupData = inject(MAT_DIALOG_DATA);
  private router = inject(Router);

  readonly statusLabels: Record<string, string> = {
    SCHEDULED: 'Agendado', CONFIRMED: 'Confirmado', COMPLETED: 'Concluído',
    NO_SHOW: 'Não compareceu', CANCELLED: 'Cancelado',
  };

  endTime(a: Appointment): string {
    const [h, m] = a.scheduledTime.split(':').map(Number);
    const end = h * 60 + m + a.durationMinutes;
    return `${Math.floor(end / 60).toString().padStart(2, '0')}:${(end % 60).toString().padStart(2, '0')}`;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  }

  viewDetails(): void {
    this.dialogRef.close();
    this.router.navigate(['/appointments', this.data.appointment.id]);
  }

  edit(): void {
    this.dialogRef.close();
    this.router.navigate(['/appointments', this.data.appointment.id, 'editar']);
  }
}
