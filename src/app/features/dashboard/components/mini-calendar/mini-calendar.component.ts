import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface CalendarDay {
  date: Date | null;
  dayNumber: number | null;
  isToday: boolean;
  hasAppointment: boolean;
  isoDate: string | null;
}

@Component({
  selector: 'app-mini-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './mini-calendar.component.html',
  styleUrl: './mini-calendar.component.css',
})
export class MiniCalendarComponent implements OnChanges {
  @Input() daysWithAppointments: string[] = [];
  @Output() dayClick = new EventEmitter<string>();

  today = new Date();
  currentMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  weeks: CalendarDay[][] = [];

  weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  get monthLabel(): string {
    return this.currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  ngOnChanges(): void {
    this.buildCalendar();
  }

  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.buildCalendar();
  }

  onDayClick(day: CalendarDay): void {
    if (day.isoDate && day.hasAppointment) {
      this.dayClick.emit(day.isoDate);
    }
  }

  private buildCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const todayIso = this.toIso(this.today);
    const appointmentSet = new Set(this.daysWithAppointments);

    const cells: CalendarDay[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push({ date: null, dayNumber: null, isToday: false, hasAppointment: false, isoDate: null });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isoDate = this.toIso(date);
      cells.push({
        date,
        dayNumber: d,
        isToday: isoDate === todayIso,
        hasAppointment: appointmentSet.has(isoDate),
        isoDate,
      });
    }

    const remainder = cells.length % 7;
    if (remainder > 0) {
      for (let i = 0; i < 7 - remainder; i++) {
        cells.push({ date: null, dayNumber: null, isToday: false, hasAppointment: false, isoDate: null });
      }
    }

    this.weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      this.weeks.push(cells.slice(i, i + 7));
    }
  }

  private toIso(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
