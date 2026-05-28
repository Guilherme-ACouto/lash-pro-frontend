import { createReducer, on } from '@ngrx/store';
import { AppointmentState } from '../../../core/models/appointment.model';
import { AppointmentActions } from './appointment.actions';

const today = new Date().toISOString().split('T')[0];

const initialState: AppointmentState = {
  appointments: [],
  currentDate: today,
  selectedAppointment: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export const appointmentReducer = createReducer(
  initialState,

  on(AppointmentActions.loadAppointments, (state) => ({ ...state, isLoading: true, error: null })),
  on(AppointmentActions.loadAppointmentsSuccess, (state, { appointments }) => ({ ...state, isLoading: false, appointments })),
  on(AppointmentActions.loadAppointmentsFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(AppointmentActions.setDate, (state, { date }) => ({ ...state, currentDate: date, appointments: [], isLoading: true })),

  on(AppointmentActions.selectAppointment, (state) => ({ ...state, isLoading: true, selectedAppointment: null, error: null })),
  on(AppointmentActions.selectAppointmentSuccess, (state, { appointment }) => ({ ...state, isLoading: false, selectedAppointment: appointment })),
  on(AppointmentActions.selectAppointmentFailure, (state, { error }) => ({ ...state, isLoading: false, error })),
  on(AppointmentActions.clearSelectedAppointment, (state) => ({ ...state, selectedAppointment: null })),

  on(AppointmentActions.createAppointment, (state) => ({ ...state, isSaving: true, error: null })),
  on(AppointmentActions.createAppointmentSuccess, (state) => ({ ...state, isSaving: false })),
  on(AppointmentActions.createAppointmentFailure, (state, { error }) => ({ ...state, isSaving: false, error })),

  on(AppointmentActions.updateAppointment, (state) => ({ ...state, isSaving: true, error: null })),
  on(AppointmentActions.updateAppointmentSuccess, (state) => ({ ...state, isSaving: false })),
  on(AppointmentActions.updateAppointmentFailure, (state, { error }) => ({ ...state, isSaving: false, error })),

  on(
    AppointmentActions.confirmAppointment,
    AppointmentActions.completeAppointment,
    AppointmentActions.cancelAppointment,
    AppointmentActions.noShowAppointment,
    (state) => ({ ...state, isSaving: true, error: null })
  ),
  on(
    AppointmentActions.confirmAppointmentSuccess,
    AppointmentActions.completeAppointmentSuccess,
    AppointmentActions.cancelAppointmentSuccess,
    AppointmentActions.noShowAppointmentSuccess,
    (state) => ({ ...state, isSaving: false })
  ),
  on(
    AppointmentActions.confirmAppointmentFailure,
    AppointmentActions.completeAppointmentFailure,
    AppointmentActions.cancelAppointmentFailure,
    AppointmentActions.noShowAppointmentFailure,
    (state, { error }) => ({ ...state, isSaving: false, error })
  ),
);
