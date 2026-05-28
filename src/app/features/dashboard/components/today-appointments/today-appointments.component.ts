import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TodayAppointment } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-today-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './today-appointments.component.html',
  styleUrl: './today-appointments.component.css',
})
export class TodayAppointmentsComponent {
  @Input() appointments: TodayAppointment[] = [];

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      SCHEDULED: 'Agendado',
      CONFIRMED: 'Confirmado',
      COMPLETED: 'Realizado',
      CANCELLED: 'Cancelado',
    };
    return labels[status] ?? status;
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }
}
