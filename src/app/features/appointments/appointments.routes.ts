import { Routes } from '@angular/router';
import { AppointmentDayComponent } from './components/appointment-day/appointment-day.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { AppointmentDetailComponent } from './components/appointment-detail/appointment-detail.component';

export const appointmentsRoutes: Routes = [
  { path: '', component: AppointmentDayComponent },
  { path: 'novo', component: AppointmentFormComponent },
  { path: ':id', component: AppointmentDetailComponent },
  { path: ':id/editar', component: AppointmentFormComponent },
];
