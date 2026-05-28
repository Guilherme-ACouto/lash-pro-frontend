export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  scheduledDate: string;   // "YYYY-MM-DD"
  scheduledTime: string;   // "HH:mm:ss"
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  financialEntryId?: string;
  createdAt: string;
}

export interface CreateAppointmentRequest {
  clientId: string;
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  notes?: string;
}

export interface AppointmentState {
  appointments: Appointment[];
  currentDate: string;           // "YYYY-MM-DD"
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

export interface TimeSlot {
  time: string;        // "06:00", "06:30", ...
  appointment: Appointment | null;
}
