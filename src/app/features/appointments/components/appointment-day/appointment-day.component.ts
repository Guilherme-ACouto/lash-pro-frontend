import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../../../../core/models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentActions } from '../../store/appointment.actions';
import { selectCurrentDate } from '../../store/appointment.selectors';
import { AppointmentPopupComponent } from '../appointment-popup/appointment-popup.component';
import { DayAppointmentsModalComponent } from '../day-appointments-modal/day-appointments-modal.component';

export type CalendarView = 'day' | 'week' | 'month';

interface WeekDay {
  date: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
}

interface MiniCalDay {
  date: string;
  day: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  isInSelectedWeek: boolean;
}

interface MonthCell {
  date: string;
  day: number;
  isToday: boolean;
  isCurrentMonth: boolean;
}

@Component({
  selector: 'app-appointment-day',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
  ],
  templateUrl: './appointment-day.component.html',
  styleUrl: './appointment-day.component.css'
})
export class AppointmentDayComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private svc = inject(AppointmentService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  readonly SLOT_H = 48;
  readonly START = 6 * 60;

  readonly slots: string[] = Array.from({ length: 28 }, (_, i) => {
    const min = 6 * 60 + i * 30;
    return `${Math.floor(min / 60).toString().padStart(2, '0')}:${(min % 60).toString().padStart(2, '0')}`;
  });

  readonly miniWeekDays = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  readonly monthWeekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  readonly legend = [
    { status: 'SCHEDULED', label: 'Agendado' },
    { status: 'CONFIRMED', label: 'Confirmado' },
    { status: 'COMPLETED', label: 'Concluído' },
    { status: 'NO_SHOW',   label: 'Não compareceu' },
    { status: 'CANCELLED', label: 'Cancelado' },
  ];

  readonly professionals = [
    { id: 'all', name: 'Todas' },
    { id: 'default', name: 'Profissional padrão' },
  ];
  selectedProfessional = 'all';

  // ── Estado das views ──────────────────────────────
  currentView: CalendarView = 'week';

  // ── Dados semana/dia ──────────────────────────────
  weekDays: WeekDay[] = [];
  weekData: Record<string, Appointment[]> = {};
  weekLoading = false;
  currentDate = '';

  // ── Dados mês ─────────────────────────────────────
  monthCells: MonthCell[] = [];
  monthData: Record<string, Appointment[]> = {};
  monthLoading = false;

  // ── Mini calendário ───────────────────────────────
  miniMonth: Date = new Date();
  miniCalDays: MiniCalDay[] = [];

  ngOnInit(): void {
    this.store.select(selectCurrentDate).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(date => {
      this.currentDate = date;
      this.weekDays = this.buildWeekDays(date);
      const d = new Date(date + 'T12:00:00');
      this.miniMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      this.buildMiniCal();
      if (this.currentView === 'month') {
        this.buildMonthCells();
        this.loadMonth();
      } else {
        this.loadWeek(date);
      }
    });
  }

  // ── View toggle ───────────────────────────────────

  setView(view: CalendarView): void {
    this.currentView = view;
    if (view === 'month') {
      this.buildMonthCells();
      this.loadMonth();
    } else {
      this.loadWeek(this.currentDate);
    }
  }

  navigate(dir: -1 | 1): void {
    const d = new Date(this.currentDate + 'T12:00:00');
    if (this.currentView === 'day') {
      d.setDate(d.getDate() + dir);
    } else if (this.currentView === 'week') {
      d.setDate(d.getDate() + dir * 7);
    } else {
      d.setMonth(d.getMonth() + dir);
    }
    this.store.dispatch(AppointmentActions.setDate({ date: d.toISOString().split('T')[0] }));
  }

  goToday(): void {
    this.store.dispatch(AppointmentActions.setDate({ date: new Date().toISOString().split('T')[0] }));
  }

  getNavLabel(): string {
    if (this.currentView === 'month') return this.getMonthHeader();
    return this.getWeekRange();
  }

  // ── Mini calendário ───────────────────────────────

  buildMiniCal(): void {
    const firstDay = new Date(this.miniMonth.getFullYear(), this.miniMonth.getMonth(), 1);
    const startDow = firstDay.getDay();
    const offset = startDow === 0 ? 6 : startDow - 1;
    const today = new Date().toISOString().split('T')[0];
    const days: MiniCalDay[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(firstDay);
      d.setDate(firstDay.getDate() - offset + i);
      const iso = d.toISOString().split('T')[0];
      days.push({
        date: iso,
        day: d.getDate(),
        isToday: iso === today,
        isCurrentMonth: d.getMonth() === this.miniMonth.getMonth(),
        isInSelectedWeek: this.weekDays.some(wd => wd.date === iso),
      });
    }
    this.miniCalDays = days;
  }

  getMiniCalHeader(): string {
    return this.miniMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  prevMiniMonth(): void {
    this.miniMonth = new Date(this.miniMonth.getFullYear(), this.miniMonth.getMonth() - 1, 1);
    this.buildMiniCal();
  }

  nextMiniMonth(): void {
    this.miniMonth = new Date(this.miniMonth.getFullYear(), this.miniMonth.getMonth() + 1, 1);
    this.buildMiniCal();
  }

  selectMiniDay(date: string): void {
    this.store.dispatch(AppointmentActions.setDate({ date }));
  }

  // ── Semana / Dia ──────────────────────────────────

  private buildWeekDays(dateStr: string): WeekDay[] {
    const date = new Date(dateStr + 'T12:00:00');
    const dow = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() + (dow === 0 ? -6 : 1 - dow));
    const today = new Date().toISOString().split('T')[0];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      return {
        date: iso,
        dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
        dayNumber: d.getDate(),
        isToday: iso === today,
      };
    });
  }

  private loadWeek(dateStr: string): void {
    const days = this.buildWeekDays(dateStr);
    this.weekLoading = true;
    this.weekData = {};
    const reqs: Record<string, ReturnType<typeof this.svc.listByDate>> = {};
    days.forEach(d => { reqs[d.date] = this.svc.listByDate(d.date); });
    forkJoin(reqs).subscribe({
      next: r => { this.weekData = r; this.weekLoading = false; },
      error: () => { this.weekLoading = false; }
    });
  }

  getWeekRange(): string {
    if (!this.weekDays.length) return '';
    const first = new Date(this.weekDays[0].date + 'T12:00:00');
    const last  = new Date(this.weekDays[6].date + 'T12:00:00');
    const lastMonth = last.toLocaleDateString('pt-BR', { month: 'long' });
    const year = last.getFullYear();
    if (first.getMonth() === last.getMonth()) {
      return `${first.getDate()} – ${last.getDate()} de ${lastMonth} ${year}`;
    }
    const firstMonth = first.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    return `${first.getDate()} de ${firstMonth} – ${last.getDate()} de ${lastMonth} ${year}`;
  }

  getDayLabel(): string {
    const d = new Date(this.currentDate + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  getCurrentWeekDay(): WeekDay | null {
    return this.weekDays.find(d => d.date === this.currentDate) ?? null;
  }

  apptTop(a: Appointment): number {
    const [h, m] = a.scheduledTime.split(':').map(Number);
    return ((h * 60 + m - this.START) / 30) * this.SLOT_H;
  }

  apptHeight(a: Appointment): number {
    return Math.max((a.durationMinutes / 30) * this.SLOT_H - 3, 20);
  }

  endTime(a: Appointment): string {
    const [h, m] = a.scheduledTime.split(':').map(Number);
    const end = h * 60 + m + a.durationMinutes;
    return `${Math.floor(end / 60).toString().padStart(2, '0')}:${(end % 60).toString().padStart(2, '0')}`;
  }

  onColClick(event: MouseEvent, date: string): void {
    if ((event.target as HTMLElement).closest('.appt-block')) return;
    const col = event.currentTarget as HTMLElement;
    const y = event.clientY - col.getBoundingClientRect().top;
    const slotIdx = Math.max(0, Math.min(Math.floor(y / this.SLOT_H), this.slots.length - 1));
    this.router.navigate(['/appointments/novo'], { queryParams: { date, time: this.slots[slotIdx] } });
  }

  getAppts(date: string): Appointment[] {
    return this.weekData[date] ?? [];
  }

  // ── Mês ───────────────────────────────────────────

  buildMonthCells(): void {
    const d = new Date(this.currentDate + 'T12:00:00');
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
    const startDow = firstDay.getDay();
    const offset = startDow === 0 ? 6 : startDow - 1;
    const today = new Date().toISOString().split('T')[0];
    const cells: MonthCell[] = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(firstDay);
      day.setDate(firstDay.getDate() - offset + i);
      const iso = day.toISOString().split('T')[0];
      cells.push({
        date: iso,
        day: day.getDate(),
        isToday: iso === today,
        isCurrentMonth: day.getMonth() === d.getMonth(),
      });
    }
    this.monthCells = cells;
  }

  private loadMonth(): void {
    if (!this.monthCells.length) return;
    const startDate = this.monthCells[0].date;
    const endDate = this.monthCells[41].date;
    this.monthLoading = true;
    this.svc.listByDateRange(startDate, endDate).subscribe({
      next: appointments => {
        const grouped: Record<string, Appointment[]> = {};
        appointments.forEach(a => {
          if (!grouped[a.scheduledDate]) grouped[a.scheduledDate] = [];
          grouped[a.scheduledDate].push(a);
        });
        this.monthData = grouped;
        this.monthLoading = false;
      },
      error: () => { this.monthLoading = false; }
    });
  }

  getMonthAppts(date: string): Appointment[] {
    return this.monthData[date] ?? [];
  }

  getMonthHeader(): string {
    const d = new Date(this.currentDate + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  switchToDayView(date: string): void {
    this.store.dispatch(AppointmentActions.setDate({ date }));
    this.currentView = 'day';
    this.loadWeek(date);
  }

  openAppointmentPopup(appt: Appointment, event: Event): void {
    event.stopPropagation();
    this.dialog.open(AppointmentPopupComponent, {
      data: { appointment: appt },
      width: '380px',
      panelClass: 'appt-popup-panel',
    });
  }

  openDayModal(date: string, event: Event): void {
    event.stopPropagation();
    this.dialog.open(DayAppointmentsModalComponent, {
      data: { date, appointments: this.getMonthAppts(date) },
      width: '320px',
      panelClass: 'day-modal-panel',
    });
  }
}
