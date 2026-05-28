import { createAction, props } from '@ngrx/store';
import { Appointment, CreateAppointmentRequest } from '../../../core/models/appointment.model';

export const AppointmentActions = {
  loadAppointments: createAction('[Appointments] Load Appointments', props<{ date: string }>()),
  loadAppointmentsSuccess: createAction('[Appointments] Load Appointments Success', props<{ appointments: Appointment[] }>()),
  loadAppointmentsFailure: createAction('[Appointments] Load Appointments Failure', props<{ error: string }>()),

  setDate: createAction('[Appointments] Set Date', props<{ date: string }>()),

  selectAppointment: createAction('[Appointments] Select Appointment', props<{ id: string }>()),
  selectAppointmentSuccess: createAction('[Appointments] Select Appointment Success', props<{ appointment: Appointment }>()),
  selectAppointmentFailure: createAction('[Appointments] Select Appointment Failure', props<{ error: string }>()),
  clearSelectedAppointment: createAction('[Appointments] Clear Selected Appointment'),

  createAppointment: createAction('[Appointments] Create Appointment', props<{ request: CreateAppointmentRequest }>()),
  createAppointmentSuccess: createAction('[Appointments] Create Appointment Success', props<{ appointment: Appointment }>()),
  createAppointmentFailure: createAction('[Appointments] Create Appointment Failure', props<{ error: string }>()),

  updateAppointment: createAction('[Appointments] Update Appointment', props<{ id: string; request: CreateAppointmentRequest }>()),
  updateAppointmentSuccess: createAction('[Appointments] Update Appointment Success', props<{ appointment: Appointment }>()),
  updateAppointmentFailure: createAction('[Appointments] Update Appointment Failure', props<{ error: string }>()),

  confirmAppointment: createAction('[Appointments] Confirm Appointment', props<{ id: string }>()),
  confirmAppointmentSuccess: createAction('[Appointments] Confirm Appointment Success'),
  confirmAppointmentFailure: createAction('[Appointments] Confirm Appointment Failure', props<{ error: string }>()),

  completeAppointment: createAction('[Appointments] Complete Appointment', props<{ id: string; paymentMethod: string }>()),
  completeAppointmentSuccess: createAction('[Appointments] Complete Appointment Success'),
  completeAppointmentFailure: createAction('[Appointments] Complete Appointment Failure', props<{ error: string }>()),

  cancelAppointment: createAction('[Appointments] Cancel Appointment', props<{ id: string }>()),
  cancelAppointmentSuccess: createAction('[Appointments] Cancel Appointment Success'),
  cancelAppointmentFailure: createAction('[Appointments] Cancel Appointment Failure', props<{ error: string }>()),

  noShowAppointment: createAction('[Appointments] No Show Appointment', props<{ id: string }>()),
  noShowAppointmentSuccess: createAction('[Appointments] No Show Appointment Success'),
  noShowAppointmentFailure: createAction('[Appointments] No Show Appointment Failure', props<{ error: string }>()),
};
