import { createReducer, on } from '@ngrx/store';
import { DashboardData, DashboardPeriod } from '../../../core/models/dashboard.model';
import { DashboardActions } from './dashboard.actions';

export interface DashboardState {
  data: DashboardData | null;
  period: DashboardPeriod;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  period: 'WEEK',
  isLoading: false,
  error: null,
};

export const dashboardReducer = createReducer(
  initialState,

  on(DashboardActions.setPeriod, (state, { period }) => ({
    ...state,
    period,
    isLoading: true,
    error: null,
  })),

  on(DashboardActions.loadDashboard, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(DashboardActions.loadDashboardSuccess, (state, { data }) => ({
    ...state,
    isLoading: false,
    data,
  })),

  on(DashboardActions.loadDashboardFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
