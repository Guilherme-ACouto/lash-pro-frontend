import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { DashboardActions } from './store/dashboard.actions';
import {
  selectDashboardPeriod,
  selectDashboardLoading,
  selectKpis,
  selectAppointmentsSeries,
  selectCashFlowSeries,
  selectTodayAppointments,
} from './store/dashboard.selectors';
import { selectCurrentUser } from '../auth/store/auth.selectors';

import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { AppointmentsChartComponent } from './components/appointments-chart/appointments-chart.component';
import { CashFlowChartComponent } from './components/cash-flow-chart/cash-flow-chart.component';
import { TodayAppointmentsComponent } from './components/today-appointments/today-appointments.component';
import { DashboardPeriod } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    KpiCardComponent,
    AppointmentsChartComponent,
    CashFlowChartComponent,
    TodayAppointmentsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);

  period$ = this.store.select(selectDashboardPeriod);
  loading$ = this.store.select(selectDashboardLoading);
  kpis$ = this.store.select(selectKpis);
  appointmentsSeries$ = this.store.select(selectAppointmentsSeries);
  cashFlowSeries$ = this.store.select(selectCashFlowSeries);
  todayAppointments$ = this.store.select(selectTodayAppointments);
  currentUser$ = this.store.select(selectCurrentUser);

  ngOnInit(): void {
    this.store.dispatch(DashboardActions.loadDashboard({ period: 'WEEK' }));
  }

  setPeriod(period: DashboardPeriod): void {
    this.store.dispatch(DashboardActions.setPeriod({ period }));
  }

  readonly periodOptions: { value: DashboardPeriod; label: string }[] = [
    { value: 'TODAY', label: 'Hoje' },
    { value: 'WEEK', label: 'Semana' },
    { value: 'MONTH', label: 'Mês' },
  ];

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

}
