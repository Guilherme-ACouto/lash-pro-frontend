import { createAction, props } from '@ngrx/store';
import { DashboardData, DashboardPeriod } from '../../../core/models/dashboard.model';

export const DashboardActions = {
  setPeriod: createAction(
    '[Dashboard] Set Period',
    props<{ period: DashboardPeriod }>()
  ),
  loadDashboard: createAction(
    '[Dashboard] Load Dashboard',
    props<{ period: DashboardPeriod }>()
  ),
  loadDashboardSuccess: createAction(
    '[Dashboard] Load Dashboard Success',
    props<{ data: DashboardData }>()
  ),
  loadDashboardFailure: createAction(
    '[Dashboard] Load Dashboard Failure',
    props<{ error: string }>()
  ),
};
