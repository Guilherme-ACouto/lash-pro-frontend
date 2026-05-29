import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.reducer';

const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectDashboardData = createSelector(selectDashboardState, (s) => s.data);
export const selectDashboardPeriod = createSelector(selectDashboardState, (s) => s.period);
export const selectDashboardLoading = createSelector(selectDashboardState, (s) => s.isLoading);
export const selectDashboardError = createSelector(selectDashboardState, (s) => s.error);

export const selectKpis = createSelector(selectDashboardData, (d) =>
  d ? {
    activeClients: d.activeClients,
    clientsGrowth: d.clientsGrowth,
    totalAppointments: d.totalAppointments,
    completedAppointments: d.completedAppointments,
    confirmedAppointments: d.confirmedAppointments,
    scheduledAppointments: d.scheduledAppointments,
    cancellations: d.cancellations,
    revenue: d.revenue,
    receivable: d.receivable,
    payable: d.payable,
  } : null
);

export const selectAppointmentsSeries = createSelector(selectDashboardData, (d) => d?.appointmentsSeries ?? []);
export const selectCashFlowSeries = createSelector(selectDashboardData, (d) => d?.cashFlowSeries ?? []);
export const selectTodayAppointments = createSelector(selectDashboardData, (d) => d?.todayAppointments ?? []);
