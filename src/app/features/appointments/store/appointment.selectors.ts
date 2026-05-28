import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppointmentState } from '../../../core/models/appointment.model';

const selectAppointmentsState = createFeatureSelector<AppointmentState>('appointments');

export const selectAllAppointments = createSelector(selectAppointmentsState, (s) => s.appointments);
export const selectCurrentDate = createSelector(selectAppointmentsState, (s) => s.currentDate);
export const selectSelectedAppointment = createSelector(selectAppointmentsState, (s) => s.selectedAppointment);
export const selectAppointmentsLoading = createSelector(selectAppointmentsState, (s) => s.isLoading);
export const selectAppointmentsSaving = createSelector(selectAppointmentsState, (s) => s.isSaving);
export const selectAppointmentsError = createSelector(selectAppointmentsState, (s) => s.error);
